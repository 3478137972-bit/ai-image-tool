"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { History, X } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

export function HistoryDialog() {
  const [history, setHistory] = useState<Array<{ urls: string[], prompt: string, timestamp: number }>>([])

  useEffect(() => {
    setHistory(JSON.parse(localStorage.getItem('imageHistory') || '[]'))
  }, [])

  const clearHistory = () => {
    localStorage.removeItem('imageHistory')
    setHistory([])
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <History className="w-4 h-4" />
          历史记录
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>生成历史</span>
            {history.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearHistory}>
                <X className="w-4 h-4 mr-1" />
                清空
              </Button>
            )}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh]">
          {history.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">暂无历史记录</div>
          ) : (
            <div className="space-y-4">
              {history.map((item, idx) => (
                <div key={idx} className="border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    {new Date(item.timestamp).toLocaleString('zh-CN')}
                  </p>
                  <p className="text-sm mb-3">{item.prompt}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {item.urls.map((url, i) => (
                      <img key={i} src={url} alt="" className="w-full rounded" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
