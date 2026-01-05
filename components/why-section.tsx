"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, Users, MessageSquare, ArrowRight, Sparkles } from "lucide-react"
import { useLanguage } from "./language-provider"

export function WhySection() {
  const { t } = useLanguage()

  const reasons = [
    {
      icon: Zap,
      title: t("why.perfect.title"),
      description: t("why.perfect.desc"),
      gradient: "from-accent/10 to-accent-secondary/10",
      iconColor: "text-accent",
    },
    {
      icon: Users,
      title: t("why.consistency.title"),
      description: t("why.consistency.desc"),
      gradient: "from-accent-secondary/10 to-accent-tertiary/10",
      iconColor: "text-accent-secondary",
    },
    {
      icon: MessageSquare,
      title: t("why.natural.title"),
      description: t("why.natural.desc"),
      gradient: "from-accent-tertiary/10 to-accent/10",
      iconColor: "text-accent-tertiary",
    },
  ]

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-muted/30 to-background" />
      <div className="absolute top-20 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -z-10 animate-pulse-glow" />
      <div
        className="absolute bottom-20 left-0 w-96 h-96 bg-accent-secondary/5 rounded-full blur-3xl -z-10 animate-pulse-glow"
        style={{ animationDelay: "1s" }}
      />

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <Badge variant="outline" className="border-accent/30 text-accent">
              <Sparkles className="w-3 h-3 mr-1" />
              Why Us
            </Badge>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            {t("why.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">{t("why.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          {reasons.map((reason, index) => (
            <Card
              key={index}
              className="group hover:shadow-2xl hover:shadow-accent/10 transition-all duration-300 hover:-translate-y-2 border-accent/10 relative overflow-hidden"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${reason.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`}
              />
              <CardContent className="p-6 text-center relative">
                <div className="relative inline-block mb-4">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${reason.gradient} flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                  >
                    <reason.icon className={`h-8 w-8 ${reason.iconColor}`} />
                  </div>
                  <div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${reason.gradient} blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300`}
                  />
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-accent transition-colors">{reason.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{reason.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button
            size="lg"
            className="gap-2 bg-gradient-to-r from-accent to-accent-secondary hover:shadow-lg hover:shadow-accent/30 transition-all duration-300 group"
          >
            <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform" />
            {t("why.cta")}
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  )
}
