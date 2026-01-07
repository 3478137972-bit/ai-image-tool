"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, Menu } from "lucide-react"
import { useLanguage } from "./language-provider"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { supabase } from "@/lib/supabase"

export function Header() {
  const { language, setLanguage, t } = useLanguage()
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

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`
      }
    })
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

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
          <Link
            href="/pricing"
            className="text-sm font-medium hover:text-accent transition-colors"
          >
            {t("nav.pricing")}
          </Link>
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
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground hidden md:inline">{user.email}</span>
              <Button onClick={handleLogout} variant="outline" size="sm">
                退出登录
              </Button>
            </div>
          ) : (
            <Button onClick={handleGoogleLogin} variant="outline" size="sm" className="gap-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              使用 Google 登录
            </Button>
          )}
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
                <Link
                  href="/pricing"
                  className="text-lg font-medium hover:text-accent transition-colors text-left"
                >
                  {t("nav.pricing")}
                </Link>
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
