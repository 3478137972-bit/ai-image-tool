"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Quote, Sparkles } from "lucide-react"
import { useLanguage } from "./language-provider"

export function TestimonialsSection() {
  const { t } = useLanguage()

  const testimonials = [
    {
      rating: 5,
      text: t("testimonials.1.text"),
      name: t("testimonials.1.name"),
      title: t("testimonials.1.title"),
      gradient: "from-accent/5 to-accent-secondary/5",
    },
    {
      rating: 5,
      text: t("testimonials.2.text"),
      name: t("testimonials.2.name"),
      title: t("testimonials.2.title"),
      gradient: "from-accent-secondary/5 to-accent-tertiary/5",
    },
    {
      rating: 5,
      text: t("testimonials.3.text"),
      name: t("testimonials.3.name"),
      title: t("testimonials.3.title"),
      gradient: "from-accent-tertiary/5 to-accent/5",
    },
  ]

  return (
    <section id="testimonials" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-muted/50 via-background to-background" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-secondary/5 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-accent fill-accent animate-pulse" />
            <Badge variant="outline" className="border-accent/30 text-accent">
              Testimonials
            </Badge>
            <Star className="w-5 h-5 text-accent fill-accent animate-pulse" style={{ animationDelay: "0.5s" }} />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            {t("testimonials.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">{t("testimonials.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="relative group hover:shadow-2xl hover:shadow-accent/10 transition-all duration-300 hover:-translate-y-1 border-accent/10 overflow-hidden"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${testimonial.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`}
              />
              <CardContent className="p-6 relative">
                <Quote className="w-10 h-10 text-accent/20 mb-4" />
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-sm mb-6 leading-relaxed">{testimonial.text}</p>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent-secondary flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.title}</p>
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
