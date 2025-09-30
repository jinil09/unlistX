import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Lock, Users, Building2, TrendingUp } from "lucide-react"
import { Logo } from "@/components/logo"
import Image from "next/image"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#2563eb] via-[#4f46e5] to-[#7c3aed]">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 py-8">
        {/* Navigation */}
        <nav className="flex items-center justify-between mb-20">
          <Logo className="text-white" />
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2.5">
                <Users className="h-4 w-4 text-white" />
                <span className="text-white font-semibold text-sm">200+ Active Investors</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2.5">
                <Building2 className="h-4 w-4 text-white" />
                <span className="text-white font-semibold text-sm">150 Unlisted and Pre-IPO start-ups</span>
              </div>
              <Link href="/secondary-market">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2.5 hover:bg-white/20 transition-colors cursor-pointer">
                  <TrendingUp className="h-4 w-4 text-white" />
                  <span className="text-white font-semibold text-sm">Secondary Market</span>
                </div>
              </Link>
            </div>
            <Button variant="ghost" className="text-white hover:bg-white/10">
              Login
            </Button>
            <Link href="/register">
              <Button className="bg-white text-primary hover:bg-white/90">Register</Button>
            </Link>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-200px)]">
          <div className="space-y-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-white leading-relaxed text-balance">
              Safe, transparent, and reliable transactions for unlisted and Pre-IPO Start-ups.
            </h1>
            <p className="text-xl text-white/90 leading-relaxed text-pretty">
              A secure platform for primary and secondary share deals, powered by SEBI-registered intermediaries.
            </p>

            <Link href="/register">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 h-auto">
                Get Early Access
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>

            {/* Trust Badges */}
            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-center gap-2 text-white/90">
                <Shield className="h-5 w-5" />
                <span className="text-sm font-medium">Certified Insights</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <Lock className="h-5 w-5" />
                <span className="text-sm font-medium">Secure Platform</span>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block h-[600px]">
            {/* Background Dashboard - Main Portfolio View */}
            <div className="absolute top-0 left-0 w-[450px] h-[300px] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/40 bg-white">
              <Image src="/dashboard-main.jpg" alt="Portfolio Dashboard" fill className="object-cover" />
            </div>

            {/* Middle Dashboard - Trading Interface (overlapping) */}
            <div className="absolute top-[120px] left-[100px] w-[450px] h-[300px] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/40 bg-white z-10">
              <Image src="/dashboard-trades.jpg" alt="Trading Interface" fill className="object-cover" />
            </div>

            {/* Floating Stat Card - Portfolio Value */}
            <div className="absolute top-[40px] right-[20px] bg-white rounded-xl shadow-xl p-6 z-20 border border-gray-100">
              <div className="text-sm text-gray-600 mb-1">Portfolio Value</div>
              <div className="text-3xl font-bold text-gray-900">₹24.5L</div>
              <div className="text-sm text-green-600 font-medium mt-1">+18.2% ↑</div>
            </div>

            {/* Floating Stat Card - Returns */}
            <div className="absolute top-[240px] right-[60px] bg-white rounded-xl shadow-xl p-6 z-20 border border-gray-100">
              <div className="text-sm text-gray-600 mb-1">Total Returns</div>
              <div className="text-3xl font-bold text-gray-900">₹3.8L</div>
              <div className="text-sm text-blue-600 font-medium mt-1">15.5% gain</div>
            </div>

            {/* Floating Stat Card - Active Deals */}
            <div className="absolute bottom-[20px] left-[40px] bg-white rounded-xl shadow-xl p-6 z-20 border border-gray-100">
              <div className="text-sm text-gray-600 mb-1">Active Deals</div>
              <div className="text-3xl font-bold text-gray-900">12</div>
              <div className="text-sm text-purple-600 font-medium mt-1">3 pending</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
