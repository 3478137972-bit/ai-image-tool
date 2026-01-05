"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useLanguage } from "./language-provider"

export function CTASection() {
  const { t } = useLanguage()

  return (
    <section className="py-20 bg-accent/5">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">{t("cta.title")}</h2>
          <p className="text-lg text-muted-foreground mb-8">{t("cta.subtitle")}</p>
          <Button size="lg" className="gap-2">
            {t("cta.button")}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
