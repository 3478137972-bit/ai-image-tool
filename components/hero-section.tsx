"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Sparkles, Wand2, Zap, Stars } from "lucide-react"
import { useLanguage } from "./language-provider"

export function HeroSection() {
  const { t } = useLanguage()

  const scrollToGenerator = () => {
    const element = document.getElementById("generator")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section id="home" className="relative overflow-hidden py-20 md:py-32">
      <div className="absolute inset-0 -z-10 gradient-mesh" />

      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse-glow" />
        <div
          className="absolute bottom-10 right-1/4 w-[32rem] h-[32rem] bg-accent-secondary/20 rounded-full blur-3xl animate-pulse-glow"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-80 h-80 bg-accent-tertiary/15 rounded-full blur-3xl animate-pulse-glow"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <Sparkles className="absolute top-20 left-[10%] w-6 h-6 text-accent/40 animate-float" />
        <Stars
          className="absolute top-40 right-[15%] w-8 h-8 text-accent-secondary/40 animate-float"
          style={{ animationDelay: "1s" }}
        />
        <Wand2
          className="absolute bottom-32 left-[20%] w-7 h-7 text-accent-tertiary/40 animate-float"
          style={{ animationDelay: "2s" }}
        />
        <Zap
          className="absolute bottom-20 right-[25%] w-6 h-6 text-accent/40 animate-float"
          style={{ animationDelay: "0.5s" }}
        />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="mx-auto max-w-4xl text-center">
          <Badge
            variant="secondary"
            className="mb-6 bg-gradient-to-r from-accent/10 to-accent-secondary/10 border-accent/20 backdrop-blur-sm"
          >
            <Sparkles className="w-3 h-3 mr-1.5 text-accent" />
            {t("hero.badge")}
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-balance bg-gradient-to-br from-foreground via-foreground to-foreground/70 bg-clip-text">
            {t("hero.title")}
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 text-balance max-w-2xl mx-auto">
            {t("hero.subtitle")}
          </p>

          <Button
            size="lg"
            className="gap-2 bg-gradient-to-r from-accent to-accent-secondary hover:shadow-lg hover:shadow-accent/20 transition-all duration-300 group"
            onClick={scrollToGenerator}
          >
            <Sparkles className="h-4 w-4 group-hover:rotate-12 transition-transform" />
            {t("hero.cta")}
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span>{t("hero.feature1")}</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full bg-accent-secondary animate-pulse"
                style={{ animationDelay: "0.5s" }}
              />
              <span>{t("hero.feature2")}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent-tertiary animate-pulse" style={{ animationDelay: "1s" }} />
              <span>{t("hero.feature3")}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
