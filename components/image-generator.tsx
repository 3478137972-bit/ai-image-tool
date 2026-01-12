"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Upload, Sparkles, ImageIcon, Zap, CheckCircle2, X } from "lucide-react"
import { useLanguage } from "./language-provider"
import { HistoryDialog } from "./history-dialog"
import { supabase } from "@/lib/supabase"

export function ImageGenerator() {
  const { t } = useLanguage()
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [prompt, setPrompt] = useState("")
  const [textPrompt, setTextPrompt] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const [i2iResolution, setI2iResolution] = useState("2K")
  const [i2iAspectRatio, setI2iAspectRatio] = useState("1:1")
  const [i2iModel, setI2iModel] = useState("nano-banana-pro")
  const [t2iResolution, setT2iResolution] = useState("2K")
  const [t2iAspectRatio, setT2iAspectRatio] = useState("1:1")
  const [t2iModel, setT2iModel] = useState("nano-banana-pro")
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLoginRequired = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`
      }
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).slice(0, 8 - selectedFiles.length)
      setSelectedFiles([...selectedFiles, ...newFiles].slice(0, 8))
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files).slice(0, 8 - selectedFiles.length)
      setSelectedFiles([...selectedFiles, ...newFiles].slice(0, 8))
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index))
  }

  const handleGenerate = async () => {
    if (!user) {
      handleLoginRequired()
      return
    }

    setIsGenerating(true)
    setProgress(0)
    setGeneratedImages([])

    let progressInterval: NodeJS.Timeout | null = null
    let currentProgress = 0

    progressInterval = setInterval(() => {
      currentProgress += 0.5
      if (currentProgress < 95) {
        setProgress(Math.round(currentProgress))
      }
    }, 1000)

    try {
      const imageUrls = []
      for (let i = 0; i < selectedFiles.length; i++) {
        const formData = new FormData()
        formData.append("file", selectedFiles[i])
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })
        const uploadData = await uploadRes.json()
        imageUrls.push(uploadData.url)
      }

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          imageUrls,
          aspectRatio: i2iAspectRatio,
          resolution: i2iResolution,
          model: i2iModel,
          userId: user.id,
        }),
      })

      const result = await response.json()
      console.log("Create task result:", result)

      if (result.error) {
        // 如果有 apiResponse，显示完整的 API 响应
        if (result.apiResponse) {
          throw new Error(`${result.error}\n\nAPI 响应: ${result.apiResponse}`)
        }
        throw new Error(result.error)
      }

      if (!result.data?.taskId && !result.data?.recordId) {
        throw new Error(`未获取到任务ID。API返回: ${JSON.stringify(result)}`)
      }

      const taskId = result.data.taskId || result.data.recordId

      let attempts = 0
      const maxAttempts = 60
      while (attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 5000))

        const queryRes = await fetch("/api/query", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ taskId }),
        })

        const queryData = await queryRes.json()
        console.log("Query attempt", attempts + 1, ":", queryData)

        if (queryData.code === 200 && queryData.data) {
          const state = queryData.data.state
          const resultJson = queryData.data.resultJson

          if (state === "success" && resultJson) {
            if (progressInterval) clearInterval(progressInterval)
            setProgress(100)
            const result = JSON.parse(resultJson)
            const urls = result.resultUrls || []
            setGeneratedImages(urls)
            const history = JSON.parse(localStorage.getItem('imageHistory') || '[]')
            history.unshift({ urls, prompt: prompt || textPrompt, timestamp: Date.now() })
            localStorage.setItem('imageHistory', JSON.stringify(history.slice(0, 50)))
            break
          } else if (state === "failed") {
            throw new Error("生成失败")
          }
        }

        attempts++
      }

      if (attempts >= maxAttempts) {
        throw new Error("生成超时，请稍后重试")
      }
    } catch (error) {
      console.error("Generation error:", error)
      alert(error instanceof Error ? error.message : "生成失败，请重试")
    } finally {
      if (progressInterval) clearInterval(progressInterval)
      setIsGenerating(false)
    }
  }

  const handleTextToImageGenerate = async () => {
    if (!user) {
      handleLoginRequired()
      return
    }

    setIsGenerating(true)
    setProgress(0)
    setGeneratedImages([])

    let progressInterval: NodeJS.Timeout | null = null
    let currentProgress = 0

    progressInterval = setInterval(() => {
      currentProgress += 0.5
      if (currentProgress < 95) {
        setProgress(Math.round(currentProgress))
      }
    }, 1000)

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: textPrompt,
          imageUrls: [],
          aspectRatio: t2iAspectRatio,
          resolution: t2iResolution,
          model: t2iModel,
          userId: user.id,
        }),
      })

      const result = await response.json()
      console.log("Create task result:", result)

      if (result.error) {
        // 如果有 apiResponse，显示完整的 API 响应
        if (result.apiResponse) {
          throw new Error(`${result.error}\n\nAPI 响应: ${result.apiResponse}`)
        }
        throw new Error(result.error)
      }

      if (!result.data?.taskId && !result.data?.recordId) {
        throw new Error(`未获取到任务ID。API返回: ${JSON.stringify(result)}`)
      }

      const taskId = result.data.taskId || result.data.recordId

      let attempts = 0
      const maxAttempts = 60
      while (attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 5000))

        const queryRes = await fetch("/api/query", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ taskId }),
        })

        const queryData = await queryRes.json()
        console.log("Query attempt", attempts + 1, ":", queryData)

        if (queryData.code === 200 && queryData.data) {
          const state = queryData.data.state
          const resultJson = queryData.data.resultJson

          if (state === "success" && resultJson) {
            if (progressInterval) clearInterval(progressInterval)
            setProgress(100)
            const result = JSON.parse(resultJson)
            const urls = result.resultUrls || []
            setGeneratedImages(urls)
            const history = JSON.parse(localStorage.getItem('imageHistory') || '[]')
            history.unshift({ urls, prompt: prompt || textPrompt, timestamp: Date.now() })
            localStorage.setItem('imageHistory', JSON.stringify(history.slice(0, 50)))
            break
          } else if (state === "failed") {
            throw new Error("生成失败")
          }
        }

        attempts++
      }

      if (attempts >= maxAttempts) {
        throw new Error("生成超时，请稍后重试")
      }
    } catch (error) {
      console.error("Generation error:", error)
      alert(error instanceof Error ? error.message : "生成失败，请重试")
    } finally {
      if (progressInterval) clearInterval(progressInterval)
      setIsGenerating(false)
    }
  }

  return (
    <section id="generator" className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-muted/30 via-background to-background" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-4">
        <Card className="max-w-7xl mx-auto shadow-xl border-accent/10 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6 md:p-8">
            {/* History Button */}
            <div className="flex justify-end mb-4">
              <HistoryDialog />
            </div>
            <Tabs defaultValue="image-to-image">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted/50">
                <TabsTrigger
                  value="image-to-image"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-accent data-[state=active]:to-accent-secondary data-[state=active]:text-accent-foreground"
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  {t("gen.imageToImage")}
                </TabsTrigger>
                <TabsTrigger
                  value="text-to-image"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-accent data-[state=active]:to-accent-secondary data-[state=active]:text-accent-foreground"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {t("gen.textToImage")}
                </TabsTrigger>
              </TabsList>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left column - Input controls */}
                <div className="space-y-6">
              <TabsContent value="text-to-image" className="space-y-6 mt-0">
                {/* Model Selection */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-accent" />
                    {t("gen.model")}
                  </Label>
                  <Select value={t2iModel} onValueChange={setT2iModel}>
                    <SelectTrigger className="border-accent/20 focus:border-accent">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nano-banana-pro">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-accent" />
                          Nano Banana Pro
                        </div>
                      </SelectItem>
                      <SelectItem value="google/nano-banana">Nano Banana</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Prompt for Text to Image */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-accent" />
                    {t("gen.prompt")}
                  </Label>
                  <Textarea
                    placeholder={t("gen.promptPlaceholder")}
                    value={textPrompt}
                    onChange={(e) => setTextPrompt(e.target.value)}
                    className="h-32 resize-none border-accent/20 focus:border-accent overflow-y-auto"
                  />
                  <p className="text-xs text-muted-foreground text-right">{textPrompt.length}/5000</p>
                </div>

                {/* Resolution - only show for nano-banana-pro */}
                {t2iModel === "nano-banana-pro" && (
                  <div className="space-y-2">
                    <Label>{t("gen.resolution")}</Label>
                    <div className="grid grid-cols-3 gap-3">
                      <Button
                        variant={t2iResolution === "1K" ? "default" : "outline"}
                        className={
                          t2iResolution === "1K"
                            ? "bg-gradient-to-r from-accent to-accent-secondary text-accent-foreground"
                            : "border-accent/20 hover:border-accent hover:bg-accent/10 bg-transparent"
                        }
                        onClick={() => setT2iResolution("1K")}
                      >
                        1K
                      </Button>
                      <Button
                        variant={t2iResolution === "2K" ? "default" : "outline"}
                        className={
                          t2iResolution === "2K"
                            ? "bg-gradient-to-r from-accent to-accent-secondary text-accent-foreground"
                            : "border-accent/20 hover:border-accent hover:bg-accent/10 bg-transparent"
                        }
                        onClick={() => setT2iResolution("2K")}
                      >
                        2K
                      </Button>
                      <Button
                        variant={t2iResolution === "4K" ? "default" : "outline"}
                        className={
                          t2iResolution === "4K"
                            ? "bg-gradient-to-r from-accent to-accent-secondary text-accent-foreground"
                            : "border-accent/20 hover:border-accent hover:bg-accent/10 bg-transparent"
                        }
                        onClick={() => setT2iResolution("4K")}
                      >
                        4K
                      </Button>
                    </div>
                  </div>
                )}

                {/* Aspect Ratio / Image Size */}
                <div className="space-y-2">
                  <Label>{t2iModel === "google/nano-banana" ? "Image Size" : t("gen.aspectRatio")}</Label>
                  <div className="grid grid-cols-4 gap-3">
                    <Button
                      variant={t2iAspectRatio === "auto" ? "default" : "outline"}
                      className={
                        t2iAspectRatio === "auto"
                          ? "bg-gradient-to-r from-accent to-accent-secondary text-accent-foreground flex flex-col items-center py-4 h-auto"
                          : "border-accent/20 hover:border-accent hover:bg-accent/10 flex flex-col items-center py-4 h-auto bg-transparent"
                      }
                      onClick={() => setT2iAspectRatio("auto")}
                    >
                      <div className="w-5 h-5 border-2 border-current rounded mb-1" />
                      <span className="text-xs">Auto</span>
                    </Button>
                    <Button
                      variant={t2iAspectRatio === "1:1" ? "default" : "outline"}
                      className={
                        t2iAspectRatio === "1:1"
                          ? "bg-gradient-to-r from-accent to-accent-secondary text-accent-foreground flex flex-col items-center py-4 h-auto"
                          : "border-accent/20 hover:border-accent hover:bg-accent/10 flex flex-col items-center py-4 h-auto bg-transparent"
                      }
                      onClick={() => setT2iAspectRatio("1:1")}
                    >
                      <div className="w-5 h-5 border-2 border-current rounded mb-1" />
                      <span className="text-xs">1:1</span>
                    </Button>
                    <Button
                      variant={t2iAspectRatio === "9:16" ? "default" : "outline"}
                      className={
                        t2iAspectRatio === "9:16"
                          ? "bg-gradient-to-r from-accent to-accent-secondary text-accent-foreground flex flex-col items-center py-4 h-auto"
                          : "border-accent/20 hover:border-accent hover:bg-accent/10 flex flex-col items-center py-4 h-auto bg-transparent"
                      }
                      onClick={() => setT2iAspectRatio("9:16")}
                    >
                      <div className="w-6 h-4 border-2 border-current rounded mb-1" />
                      <span className="text-xs">9:16</span>
                    </Button>
                    <Button
                      variant={t2iAspectRatio === "16:9" ? "default" : "outline"}
                      className={
                        t2iAspectRatio === "16:9"
                          ? "bg-gradient-to-r from-accent to-accent-secondary text-accent-foreground flex flex-col items-center py-4 h-auto"
                          : "border-accent/20 hover:border-accent hover:bg-accent/10 flex flex-col items-center py-4 h-auto bg-transparent"
                      }
                      onClick={() => setT2iAspectRatio("16:9")}
                    >
                      <div className="w-6 h-4 border-2 border-current rounded mb-1" />
                      <span className="text-xs">16:9</span>
                    </Button>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    <Button
                      variant={t2iAspectRatio === "3:4" ? "default" : "outline"}
                      className={
                        t2iAspectRatio === "3:4"
                          ? "bg-gradient-to-r from-accent to-accent-secondary text-accent-foreground flex flex-col items-center py-4 h-auto"
                          : "border-accent/20 hover:border-accent hover:bg-accent/10 flex flex-col items-center py-4 h-auto bg-transparent"
                      }
                      onClick={() => setT2iAspectRatio("3:4")}
                    >
                      <div className="w-5 h-5 border-2 border-current rounded mb-1" />
                      <span className="text-xs">3:4</span>
                    </Button>
                    <Button
                      variant={t2iAspectRatio === "4:3" ? "default" : "outline"}
                      className={
                        t2iAspectRatio === "4:3"
                          ? "bg-gradient-to-r from-accent to-accent-secondary text-accent-foreground flex flex-col items-center py-4 h-auto"
                          : "border-accent/20 hover:border-accent hover:bg-accent/10 flex flex-col items-center py-4 h-auto bg-transparent"
                      }
                      onClick={() => setT2iAspectRatio("4:3")}
                    >
                      <div className="w-5 h-5 border-2 border-current rounded mb-1" />
                      <span className="text-xs">4:3</span>
                    </Button>
                    <Button
                      variant={t2iAspectRatio === "3:2" ? "default" : "outline"}
                      className={
                        t2iAspectRatio === "3:2"
                          ? "bg-gradient-to-r from-accent to-accent-secondary text-accent-foreground flex flex-col items-center py-4 h-auto"
                          : "border-accent/20 hover:border-accent hover:bg-accent/10 flex flex-col items-center py-4 h-auto bg-transparent"
                      }
                      onClick={() => setT2iAspectRatio("3:2")}
                    >
                      <div className="w-5 h-4 border-2 border-current rounded mb-1" />
                      <span className="text-xs">3:2</span>
                    </Button>
                    <Button
                      variant={t2iAspectRatio === "2:3" ? "default" : "outline"}
                      className={
                        t2iAspectRatio === "2:3"
                          ? "bg-gradient-to-r from-accent to-accent-secondary text-accent-foreground flex flex-col items-center py-4 h-auto"
                          : "border-accent/20 hover:border-accent hover:bg-accent/10 flex flex-col items-center py-4 h-auto bg-transparent"
                      }
                      onClick={() => setT2iAspectRatio("2:3")}
                    >
                      <div className="w-4 h-5 border-2 border-current rounded mb-1" />
                      <span className="text-xs">2:3</span>
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <Button
                      variant={t2iAspectRatio === "5:4" ? "default" : "outline"}
                      className={
                        t2iAspectRatio === "5:4"
                          ? "bg-gradient-to-r from-accent to-accent-secondary text-accent-foreground flex flex-col items-center py-4 h-auto"
                          : "border-accent/20 hover:border-accent hover:bg-accent/10 flex flex-col items-center py-4 h-auto bg-transparent"
                      }
                      onClick={() => setT2iAspectRatio("5:4")}
                    >
                      <div className="w-5 h-5 border-2 border-current rounded mb-1" />
                      <span className="text-xs">5:4</span>
                    </Button>
                    <Button
                      variant={t2iAspectRatio === "4:5" ? "default" : "outline"}
                      className={
                        t2iAspectRatio === "4:5"
                          ? "bg-gradient-to-r from-accent to-accent-secondary text-accent-foreground flex flex-col items-center py-4 h-auto"
                          : "border-accent/20 hover:border-accent hover:bg-accent/10 flex flex-col items-center py-4 h-auto bg-transparent"
                      }
                      onClick={() => setT2iAspectRatio("4:5")}
                    >
                      <div className="w-5 h-5 border-2 border-current rounded mb-1" />
                      <span className="text-xs">4:5</span>
                    </Button>
                    <Button
                      variant={t2iAspectRatio === "21:9" ? "default" : "outline"}
                      className={
                        t2iAspectRatio === "21:9"
                          ? "bg-gradient-to-r from-accent to-accent-secondary text-accent-foreground flex flex-col items-center py-4 h-auto"
                          : "border-accent/20 hover:border-accent hover:bg-accent/10 flex flex-col items-center py-4 h-auto bg-transparent"
                      }
                      onClick={() => setT2iAspectRatio("21:9")}
                    >
                      <div className="w-7 h-3 border-2 border-current rounded mb-1" />
                      <span className="text-xs">21:9</span>
                    </Button>
                  </div>
                </div>

                <Button
                  className="w-full gap-2 bg-gradient-to-r from-accent to-accent-secondary hover:shadow-lg hover:shadow-accent/30 transition-all duration-300 group"
                  size="lg"
                  onClick={handleTextToImageGenerate}
                  disabled={isGenerating || !textPrompt}
                >
                  <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                  {isGenerating ? "生成中..." : t("gen.generate")}
                  <Zap className="h-4 w-4 group-hover:scale-110 transition-transform" />
                </Button>
              </TabsContent>

              <TabsContent value="image-to-image" className="space-y-6">
                {/* Model Selection */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-accent" />
                    {t("gen.model")}
                  </Label>
                  <Select value={i2iModel} onValueChange={setI2iModel}>
                    <SelectTrigger className="border-accent/20 focus:border-accent">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nano-banana-pro">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-accent" />
                          Nano Banana Pro
                        </div>
                      </SelectItem>
                      <SelectItem value="google/nano-banana-edit">Nano Banana Edit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Upload className="w-4 h-4 text-accent" />
                    {t("gen.upload")} ({selectedFiles.length}/8)
                  </Label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 cursor-pointer ${
                      isDragging
                        ? "border-accent bg-accent/5 scale-[1.02]"
                        : selectedFiles.length > 0
                          ? "border-accent-secondary bg-accent-secondary/5"
                          : "border-border hover:border-accent/50 hover:bg-accent/5"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                      multiple
                      disabled={selectedFiles.length >= 8}
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <div className="relative inline-block">
                        <Upload
                          className={`h-12 w-12 mx-auto mb-3 transition-all duration-300 ${
                            selectedFiles.length > 0 ? "text-accent-secondary" : "text-muted-foreground"
                          }`}
                        />
                        {selectedFiles.length > 0 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent-secondary rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      <p className="text-sm font-medium mb-1">{t("gen.upload")}</p>
                      <p className="text-xs text-muted-foreground">{t("gen.uploadHint")}</p>
                    </label>
                  </div>
                  {selectedFiles.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mt-3">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square rounded-lg border-2 border-accent-secondary/30 overflow-hidden">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            onClick={() => removeFile(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-destructive rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4 text-destructive-foreground" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Prompt */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-accent" />
                    {t("gen.prompt")}
                  </Label>
                  <Textarea
                    placeholder={t("gen.promptPlaceholder")}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="h-32 resize-none border-accent/20 focus:border-accent overflow-y-auto"
                  />
                  <p className="text-xs text-muted-foreground text-right">{prompt.length}/5000</p>
                </div>

                {/* Resolution - only show for nano-banana-pro */}
                {i2iModel === "nano-banana-pro" && (
                  <div className="space-y-2">
                    <Label>{t("gen.resolution")}</Label>
                    <div className="grid grid-cols-3 gap-3">
                      <Button
                        variant={i2iResolution === "1K" ? "default" : "outline"}
                        className={
                          i2iResolution === "1K"
                            ? "bg-gradient-to-r from-accent to-accent-secondary text-accent-foreground"
                            : "border-accent/20 hover:border-accent hover:bg-accent/10 bg-transparent"
                        }
                        onClick={() => setI2iResolution("1K")}
                      >
                        1K
                      </Button>
                      <Button
                        variant={i2iResolution === "2K" ? "default" : "outline"}
                        className={
                          i2iResolution === "2K"
                            ? "bg-gradient-to-r from-accent to-accent-secondary text-accent-foreground"
                            : "border-accent/20 hover:border-accent hover:bg-accent/10 bg-transparent"
                        }
                        onClick={() => setI2iResolution("2K")}
                      >
                        2K
                      </Button>
                      <Button
                        variant={i2iResolution === "4K" ? "default" : "outline"}
                        className={
                          i2iResolution === "4K"
                            ? "bg-gradient-to-r from-accent to-accent-secondary text-accent-foreground"
                            : "border-accent/20 hover:border-accent hover:bg-accent/10 bg-transparent"
                        }
                        onClick={() => setI2iResolution("4K")}
                      >
                        4K
                      </Button>
                    </div>
                  </div>
                )}

                {/* Aspect Ratio / Image Size */}
                <div className="space-y-2">
                  <Label>{i2iModel === "google/nano-banana-edit" ? "Image Size" : t("gen.aspectRatio")}</Label>
                  <div className="grid grid-cols-4 gap-3">
                    <Button
                      variant={i2iAspectRatio === "1:1" ? "default" : "outline"}
                      className={
                        i2iAspectRatio === "1:1"
                          ? "bg-gradient-to-r from-accent to-accent-secondary text-accent-foreground flex flex-col items-center py-4 h-auto"
                          : "border-accent/20 hover:border-accent hover:bg-accent/10 flex flex-col items-center py-4 h-auto bg-transparent"
                      }
                      onClick={() => setI2iAspectRatio("1:1")}
                    >
                      <div className="w-5 h-5 border-2 border-current rounded mb-1" />
                      <span className="text-xs">1:1</span>
                    </Button>
                    <Button
                      variant={i2iAspectRatio === "9:16" ? "default" : "outline"}
                      className={
                        i2iAspectRatio === "9:16"
                          ? "bg-gradient-to-r from-accent to-accent-secondary text-accent-foreground flex flex-col items-center py-4 h-auto"
                          : "border-accent/20 hover:border-accent hover:bg-accent/10 flex flex-col items-center py-4 h-auto bg-transparent"
                      }
                      onClick={() => setI2iAspectRatio("9:16")}
                    >
                      <div className="w-4 h-6 border-2 border-current rounded mb-1" />
                      <span className="text-xs">9:16</span>
                    </Button>
                    <Button
                      variant={i2iAspectRatio === "16:9" ? "default" : "outline"}
                      className={
                        i2iAspectRatio === "16:9"
                          ? "bg-gradient-to-r from-accent to-accent-secondary text-accent-foreground flex flex-col items-center py-4 h-auto"
                          : "border-accent/20 hover:border-accent hover:bg-accent/10 flex flex-col items-center py-4 h-auto bg-transparent"
                      }
                      onClick={() => setI2iAspectRatio("16:9")}
                    >
                      <div className="w-6 h-4 border-2 border-current rounded mb-1" />
                      <span className="text-xs">16:9</span>
                    </Button>
                    <Button
                      variant={i2iAspectRatio === "4:3" ? "default" : "outline"}
                      className={
                        i2iAspectRatio === "4:3"
                          ? "bg-gradient-to-r from-accent to-accent-secondary text-accent-foreground flex flex-col items-center py-4 h-auto"
                          : "border-accent/20 hover:border-accent hover:bg-accent/10 flex flex-col items-center py-4 h-auto bg-transparent"
                      }
                      onClick={() => setI2iAspectRatio("4:3")}
                    >
                      <div className="w-5 h-4 border-2 border-current rounded mb-1" />
                      <span className="text-xs">4:3</span>
                    </Button>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    <Button
                      variant={i2iAspectRatio === "3:4" ? "default" : "outline"}
                      className={
                        i2iAspectRatio === "3:4"
                          ? "bg-gradient-to-r from-accent to-accent-secondary text-accent-foreground flex flex-col items-center py-4 h-auto"
                          : "border-accent/20 hover:border-accent hover:bg-accent/10 flex flex-col items-center py-4 h-auto bg-transparent"
                      }
                      onClick={() => setI2iAspectRatio("3:4")}
                    >
                      <div className="w-4 h-5 border-2 border-current rounded mb-1" />
                      <span className="text-xs">3:4</span>
                    </Button>
                    <Button
                      variant={i2iAspectRatio === "3:2" ? "default" : "outline"}
                      className={
                        i2iAspectRatio === "3:2"
                          ? "bg-gradient-to-r from-accent to-accent-secondary text-accent-foreground flex flex-col items-center py-4 h-auto"
                          : "border-accent/20 hover:border-accent hover:bg-accent/10 flex flex-col items-center py-4 h-auto bg-transparent"
                      }
                      onClick={() => setI2iAspectRatio("3:2")}
                    >
                      <div className="w-5 h-4 border-2 border-current rounded mb-1" />
                      <span className="text-xs">3:2</span>
                    </Button>
                    <Button
                      variant={i2iAspectRatio === "2:3" ? "default" : "outline"}
                      className={
                        i2iAspectRatio === "2:3"
                          ? "bg-gradient-to-r from-accent to-accent-secondary text-accent-foreground flex flex-col items-center py-4 h-auto"
                          : "border-accent/20 hover:border-accent hover:bg-accent/10 flex flex-col items-center py-4 h-auto bg-transparent"
                      }
                      onClick={() => setI2iAspectRatio("2:3")}
                    >
                      <div className="w-4 h-5 border-2 border-current rounded mb-1" />
                      <span className="text-xs">2:3</span>
                    </Button>
                    <Button
                      variant={i2iAspectRatio === "21:9" ? "default" : "outline"}
                      className={
                        i2iAspectRatio === "21:9"
                          ? "bg-gradient-to-r from-accent to-accent-secondary text-accent-foreground flex flex-col items-center py-4 h-auto"
                          : "border-accent/20 hover:border-accent hover:bg-accent/10 flex flex-col items-center py-4 h-auto bg-transparent"
                      }
                      onClick={() => setI2iAspectRatio("21:9")}
                    >
                      <div className="w-7 h-3 border-2 border-current rounded mb-1" />
                      <span className="text-xs">21:9</span>
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <Button
                      variant={i2iAspectRatio === "5:4" ? "default" : "outline"}
                      className={
                        i2iAspectRatio === "5:4"
                          ? "bg-gradient-to-r from-accent to-accent-secondary text-accent-foreground flex flex-col items-center py-4 h-auto"
                          : "border-accent/20 hover:border-accent hover:bg-accent/10 flex flex-col items-center py-4 h-auto bg-transparent"
                      }
                      onClick={() => setI2iAspectRatio("5:4")}
                    >
                      <div className="w-5 h-4 border-2 border-current rounded mb-1" />
                      <span className="text-xs">5:4</span>
                    </Button>
                    <Button
                      variant={i2iAspectRatio === "4:5" ? "default" : "outline"}
                      className={
                        i2iAspectRatio === "4:5"
                          ? "bg-gradient-to-r from-accent to-accent-secondary text-accent-foreground flex flex-col items-center py-4 h-auto"
                          : "border-accent/20 hover:border-accent hover:bg-accent/10 flex flex-col items-center py-4 h-auto bg-transparent"
                      }
                      onClick={() => setI2iAspectRatio("4:5")}
                    >
                      <div className="w-4 h-5 border-2 border-current rounded mb-1" />
                      <span className="text-xs">4:5</span>
                    </Button>
                    <Button
                      variant={i2iAspectRatio === "auto" ? "default" : "outline"}
                      className={
                        i2iAspectRatio === "auto"
                          ? "bg-gradient-to-r from-accent to-accent-secondary text-accent-foreground flex flex-col items-center py-4 h-auto"
                          : "border-accent/20 hover:border-accent hover:bg-accent/10 flex flex-col items-center py-4 h-auto bg-transparent"
                      }
                      onClick={() => setI2iAspectRatio("auto")}
                    >
                      <div className="w-5 h-5 border-2 border-current rounded mb-1" />
                      <span className="text-xs">auto</span>
                    </Button>
                  </div>
                </div>

                <Button
                  className="w-full gap-2 bg-gradient-to-r from-accent to-accent-secondary hover:shadow-lg hover:shadow-accent/30 transition-all duration-300 group"
                  size="lg"
                  onClick={handleGenerate}
                  disabled={isGenerating || selectedFiles.length === 0 || !prompt}
                >
                  <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                  {isGenerating ? "生成中..." : t("gen.generate")}
                  <Zap className="h-4 w-4 group-hover:scale-110 transition-transform" />
                </Button>
              </TabsContent>
                </div>

                {/* Right column - Preview area */}
                <div className="space-y-6">
                  {isGenerating && (
                    <div className="space-y-2 p-6 border-2 border-accent/20 rounded-lg bg-card">
                      <div className="flex justify-between text-sm">
                        <span>生成进度</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  )}

                  {generatedImages.length > 0 && (
                    <div className="space-y-3 p-6 border-2 border-accent/20 rounded-lg bg-accent/5">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-accent" />
                        生成成功
                      </h3>
                      <div className="grid grid-cols-1 gap-4">
                        {generatedImages.map((img, index) => (
                          <div key={index} className="relative group rounded-lg overflow-hidden border-2 border-accent-secondary/30">
                            <img src={img} alt={`Generated ${index + 1}`} className="w-full h-auto" />
                            <a
                              href={img}
                              download={`generated-${index + 1}.png`}
                              className="absolute top-2 right-2 p-2 bg-accent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                              title="下载图片"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                              </svg>
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {!isGenerating && generatedImages.length === 0 && (
                    <div className="flex items-center justify-center h-full min-h-[400px] p-6 border-2 border-dashed border-border rounded-lg bg-muted/20">
                      <div className="text-center text-muted-foreground">
                        <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p>生成的图片将显示在这里</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
