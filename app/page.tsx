import { HeroSection } from "@/components/wedding/hero-section"
import { RsvpForm } from "@/components/wedding/rsvp-form"
import { Footer } from "@/components/wedding/footer"

export default function WeddingPage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <RsvpForm />
      <Footer />
    </main>
  )
}
