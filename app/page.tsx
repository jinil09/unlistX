import { HeroSection } from "@/components/hero-section"
import { FeaturedOfferings } from "@/components/featured-offerings"
import { FeaturedCompanies } from "@/components/featured-companies"
import { WhyInvest } from "@/components/why-invest"
import { CompanyListing } from "@/components/company-listing"
import { GoogleReviews } from "@/components/google-reviews"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturedOfferings />
      <FeaturedCompanies />
      <WhyInvest />
      <CompanyListing />
      <GoogleReviews />
      <Footer />
    </main>
  )
}
