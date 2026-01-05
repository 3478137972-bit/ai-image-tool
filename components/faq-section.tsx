"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { HelpCircle, Sparkles } from "lucide-react"
import { useLanguage } from "./language-provider"

export function FAQSection() {
  const { t } = useLanguage()

  const faqs = [
    { question: t("faq.q1"), answer: t("faq.a1") },
    { question: t("faq.q2"), answer: t("faq.a2") },
    { question: t("faq.q3"), answer: t("faq.a3") },
    { question: t("faq.q4"), answer: t("faq.a4") },
    { question: t("faq.q5"), answer: t("faq.a5") },
    { question: t("faq.q6"), answer: t("faq.a6") },
  ]

  return (
    <section id="faq" className="py-20 bg-background relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-accent-tertiary/5 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <HelpCircle className="w-5 h-5 text-accent animate-pulse" />
            <Badge variant="outline" className="border-accent/30 text-accent">
              FAQ
            </Badge>
            <Sparkles className="w-5 h-5 text-accent animate-pulse" style={{ animationDelay: "0.5s" }} />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            {t("faq.title")}
          </h2>
          <p className="text-lg text-muted-foreground">{t("faq.subtitle")}</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-border rounded-lg px-6 hover:border-accent/30 transition-colors bg-card/50 backdrop-blur-sm"
              >
                <AccordionTrigger className="text-left hover:text-accent hover:no-underline py-5">
                  <span className="font-medium">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
