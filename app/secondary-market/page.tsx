import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Users, Shield, Zap } from "lucide-react"
import Link from "next/link"

export default function SecondaryMarketPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      <Navigation />

      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 text-balance">Secondary Market for Unlisted Shares</h1>
          <p className="text-xl text-gray-600 mb-8 text-pretty">
            Buy and sell pre-IPO shares from existing shareholders. Access liquidity and investment opportunities in
            high-growth companies.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/secondary-seller-registration">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Sell Your Shares
              </Button>
            </Link>
            <Link href="/investor/browse">
              <Button size="lg" variant="outline">
                Browse Available Shares
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <TrendingUp className="h-10 w-10 text-purple-600 mb-2" />
              <CardTitle>Liquidity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Exit your investments before IPO and realize gains from your unlisted holdings
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <Users className="h-10 w-10 text-pink-600 mb-2" />
              <CardTitle>Access</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Invest in pre-IPO companies by purchasing shares from existing shareholders
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <Shield className="h-10 w-10 text-indigo-600 mb-2" />
              <CardTitle>Secure</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Verified ownership, secure transactions, and compliant transfer processes
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <Zap className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Fast</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Quick verification, efficient matching, and streamlined settlement process
              </p>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* For Sellers */}
            <Card className="border-2 border-purple-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <CardTitle>For Sellers</CardTitle>
                <CardDescription className="text-purple-100">Exit your investment</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ol className="space-y-4">
                  <li className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-semibold">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Register</h4>
                      <p className="text-sm text-gray-600">Submit your details and share information</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-semibold">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Verification</h4>
                      <p className="text-sm text-gray-600">We verify your ownership and documents</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-semibold">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Listing</h4>
                      <p className="text-sm text-gray-600">Your shares are listed for potential buyers</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-semibold">
                      4
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Transaction</h4>
                      <p className="text-sm text-gray-600">We facilitate the sale and settlement</p>
                    </div>
                  </li>
                </ol>
                <Link href="/secondary-seller-registration" className="block mt-6">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600">Start Selling</Button>
                </Link>
              </CardContent>
            </Card>

            {/* For Buyers */}
            <Card className="border-2 border-blue-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <CardTitle>For Buyers</CardTitle>
                <CardDescription className="text-blue-100">Invest in pre-IPO companies</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ol className="space-y-4">
                  <li className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Browse</h4>
                      <p className="text-sm text-gray-600">Explore available shares from various companies</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Express Interest</h4>
                      <p className="text-sm text-gray-600">Submit your interest in specific shares</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Due Diligence</h4>
                      <p className="text-sm text-gray-600">Review company details and share information</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                      4
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Purchase</h4>
                      <p className="text-sm text-gray-600">Complete the transaction securely</p>
                    </div>
                  </li>
                </ol>
                <Link href="/investor/browse" className="block mt-6">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600">Browse Shares</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <Card className="border-0 shadow-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-purple-100 mb-8 max-w-2xl mx-auto">
              Whether you're looking to sell your unlisted shares or invest in pre-IPO companies, we're here to help.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/secondary-seller-registration">
                <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
                  Register as Seller
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 bg-transparent"
                >
                  Register as Investor
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
