import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ImageGenerator } from "@/components/image-generator"
import { FeaturesSection } from "@/components/features-section"
import { WhySection } from "@/components/why-section"
import { ShowcaseSection } from "@/components/showcase-section"
import { FAQSection } from "@/components/faq-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"
import { DailyCheckinToast } from "@/components/daily-checkin-toast"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <ImageGenerator />
      <FeaturesSection />
      <WhySection />
      <ShowcaseSection />
      <FAQSection />
      <CTASection />
      <Footer />
      <DailyCheckinToast />
    </main>
  )
}
