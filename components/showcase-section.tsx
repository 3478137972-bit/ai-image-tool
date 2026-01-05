"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, TrendingUp, Eye } from "lucide-react"
import { useLanguage } from "./language-provider"

export function ShowcaseSection() {
  const { t } = useLanguage()

  const showcaseItems = [
    {
      image: "/ai-generated-fantasy-landscape.jpg",
      prompt: "Fantasy landscape with magical castle",
      views: "12.5K",
      likes: "2.3K",
    },
    {
      image: "/ai-generated-portrait-art.jpg",
      prompt: "Professional portrait photography",
      views: "18.2K",
      likes: "3.1K",
    },
    {
      image: "/ai-generated-product-design.jpg",
      prompt: "Modern product design concept",
      views: "9.8K",
      likes: "1.9K",
    },
    {
      image: "/ai-generated-architecture.jpg",
      prompt: "Futuristic architecture design",
      views: "15.4K",
      likes: "2.7K",
    },
  ]

  return (
    <section id="showcase" className="py-20 bg-background relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-accent-tertiary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <Badge variant="outline" className="border-accent/30 text-accent">
              <TrendingUp className="w-3 h-3 mr-1" />
              Community Showcase
            </Badge>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            {t("showcase.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">{t("showcase.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {showcaseItems.map((item, index) => (
            <Card
              key={index}
              className="overflow-hidden group hover:shadow-2xl hover:shadow-accent/10 transition-all duration-300 hover:-translate-y-2 border-accent/10"
            >
              <CardContent className="p-0">
                <div className="aspect-[3/2] overflow-hidden relative">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.prompt}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Badge className="bg-accent/90 backdrop-blur-sm">
                      <Sparkles className="w-3 h-3 mr-1" />
                      AI Generated
                    </Badge>
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-br from-card to-muted/20">
                  <p className="text-sm font-medium mb-3 line-clamp-1">{item.prompt}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {item.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-accent" />
                        {item.likes}
                      </span>
                    </div>
                    <Badge variant="secondary" className="text-[10px] px-2 py-0">
                      Featured
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
