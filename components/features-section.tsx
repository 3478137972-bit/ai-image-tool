"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, ArrowRight } from "lucide-react"
import { useLanguage } from "./language-provider"

export function FeaturesSection() {
  const { t } = useLanguage()

  const features = [
    {
      title: t("features.clothing.title"),
      description: t("features.clothing.desc"),
      beforeImage: "/placeholder-kp8z3.png",
      afterImage: "/model-wearing-stylish-clothes.jpg",
      gradient: "from-accent/10 to-accent-secondary/10",
    },
    {
      title: t("features.text.title"),
      description: t("features.text.desc"),
      beforeImage: "/product-with-text.jpg",
      afterImage: "/product-without-text-clean.jpg",
      gradient: "from-accent-secondary/10 to-accent-tertiary/10",
    },
    {
      title: t("features.bg.title"),
      description: t("features.bg.desc"),
      beforeImage: "/person-plain-background.jpg",
      afterImage: "/person-with-statue-of-liberty-background.jpg",
      gradient: "from-accent-tertiary/10 to-accent/10",
    },
    {
      title: t("features.restore.title"),
      description: t("features.restore.desc"),
      beforeImage: "/old-damaged-photo-black-and-white.jpg",
      afterImage: "/restored-colorized-photo.jpg",
      gradient: "from-accent/10 to-accent-tertiary/10",
    },
  ]

  return (
    <section id="features" className="py-20 bg-background relative overflow-hidden">
      <div className="absolute top-20 left-0 w-96 h-96 bg-accent-secondary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-20 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-accent animate-pulse" />
            <Badge variant="outline" className="border-accent/30 text-accent">
              {t("features.badge")}
            </Badge>
            <Sparkles className="w-6 h-6 text-accent-secondary animate-pulse" style={{ animationDelay: "0.5s" }} />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            {t("features.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">{t("features.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="overflow-hidden group hover:shadow-2xl hover:shadow-accent/10 transition-all duration-300 hover:-translate-y-1 border-accent/10"
            >
              <CardContent className="p-6">
                <div className="relative mb-4">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg blur-xl -z-10`}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground font-medium">BEFORE</p>
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                          Original
                        </Badge>
                      </div>
                      <div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden border-2 border-border group-hover:border-accent/20 transition-colors">
                        <img
                          src={feature.beforeImage || "/placeholder.svg"}
                          alt="Before"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground font-medium">AFTER</p>
                        <Badge className="text-[10px] px-1.5 py-0 bg-gradient-to-r from-accent to-accent-secondary">
                          AI
                        </Badge>
                      </div>
                      <div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden border-2 border-accent/30 group-hover:border-accent/50 transition-colors">
                        <img
                          src={feature.afterImage || "/placeholder.svg"}
                          alt="After"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                    <ArrowRight className="w-8 h-8 text-accent opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-accent transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
