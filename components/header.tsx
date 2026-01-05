"use client"

import { Button } from "@/components/ui/button"
import { Sparkles, Menu } from "lucide-react"
import { useLanguage } from "./language-provider"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { HistoryDialog } from "./history-dialog"

export function Header() {
  const { language, setLanguage, t } = useLanguage()

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6" />
          <span className="text-xl font-bold">AI Image</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <button
            onClick={() => scrollToSection("home")}
            className="text-sm font-medium hover:text-accent transition-colors"
          >
            {t("nav.home")}
          </button>
          <button
            onClick={() => scrollToSection("features")}
            className="text-sm font-medium hover:text-accent transition-colors"
          >
            {t("nav.features")}
          </button>
          <button
            onClick={() => scrollToSection("showcase")}
            className="text-sm font-medium hover:text-accent transition-colors"
          >
            {t("nav.showcase")}
          </button>
          <button
            onClick={() => scrollToSection("testimonials")}
            className="text-sm font-medium hover:text-accent transition-colors"
          >
            {t("nav.testimonials")}
          </button>
          <button
            onClick={() => scrollToSection("faq")}
            className="text-sm font-medium hover:text-accent transition-colors"
          >
            {t("nav.faq")}
          </button>
        </nav>

        <div className="flex items-center gap-3">
          <HistoryDialog />
          <Button variant="outline" size="sm" onClick={() => setLanguage(language === "en" ? "zh" : "en")}>
            {language === "en" ? "中文" : "EN"}
          </Button>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <nav className="flex flex-col gap-4 mt-8">
                <button
                  onClick={() => scrollToSection("home")}
                  className="text-lg font-medium hover:text-accent transition-colors text-left"
                >
                  {t("nav.home")}
                </button>
                <button
                  onClick={() => scrollToSection("features")}
                  className="text-lg font-medium hover:text-accent transition-colors text-left"
                >
                  {t("nav.features")}
                </button>
                <button
                  onClick={() => scrollToSection("showcase")}
                  className="text-lg font-medium hover:text-accent transition-colors text-left"
                >
                  {t("nav.showcase")}
                </button>
                <button
                  onClick={() => scrollToSection("testimonials")}
                  className="text-lg font-medium hover:text-accent transition-colors text-left"
                >
                  {t("nav.testimonials")}
                </button>
                <button
                  onClick={() => scrollToSection("faq")}
                  className="text-lg font-medium hover:text-accent transition-colors text-left"
                >
                  {t("nav.faq")}
                </button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
