"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

const companies = [
  {
    name: "National Stock Exchange Ltd (NSE)",
    category: "Exchange",
    logo: "/nse-logo-blue.jpg",
    price: "₹2,000",
    badge: "Limited Stock",
    badgeColor: "text-teal-600 bg-teal-50",
  },
  {
    name: "Oravel Stays Ltd (Oyo Rooms)",
    category: "Hospitality",
    logo: "/oyo-logo-red.jpg",
    price: "₹51",
    badge: "1:1 Bonus Shares",
    badgeColor: "text-teal-600 bg-teal-50",
  },
  {
    name: "NCDEX Ltd",
    category: "agricultural commodity exchange",
    logo: "/ncdex-logo-orange.jpg",
    price: "₹505",
    minUnits: "28 Shares",
  },
  {
    name: "ASK Investment Managers Ltd",
    category: "Financial Services",
    logo: "/ask-investment-logo-teal.jpg",
    price: "₹1,255",
    minUnits: "4 Shares",
  },
]

export function FeaturedOfferings() {
  const [activeTab, setActiveTab] = useState("unlisted")

  return (
    <section className="py-20 bg-gradient-to-b from-[#4338ca] to-[#5b21b6]">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl lg:text-5xl font-bold text-center text-white mb-12">Featured offerings</h2>

        {/* Tab Toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-full bg-white/10 backdrop-blur-sm p-1 border border-white/20">
            <button
              onClick={() => setActiveTab("unlisted")}
              className={`px-8 py-3 rounded-full text-sm font-medium transition-all ${
                activeTab === "unlisted" ? "bg-white text-primary shadow-lg" : "text-white hover:text-white/80"
              }`}
            >
              Unlisted Shares
            </button>
            <button
              onClick={() => setActiveTab("deposits")}
              className={`px-8 py-3 rounded-full text-sm font-medium transition-all ${
                activeTab === "deposits" ? "bg-white text-primary shadow-lg" : "text-white hover:text-white/80"
              }`}
            >
              Fixed Deposits
            </button>
          </div>
        </div>

        {/* Company Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {companies.map((company, index) => (
            <Card key={index} className="bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow">
              <div className="flex flex-col items-center text-center mb-4">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <Image
                    src={company.logo || "/placeholder.svg"}
                    alt={company.name}
                    width={60}
                    height={60}
                    className="rounded-xl"
                  />
                </div>
                <h3 className="font-bold text-foreground mb-1 line-clamp-2">{company.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{company.category}</p>
                {company.badge && (
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${company.badgeColor}`}>
                    {company.badge}
                  </span>
                )}
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">PRICE</span>
                  {company.minUnits && <span className="text-sm text-muted-foreground">MIN UNITS</span>}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-foreground">{company.price}</span>
                  {company.minUnits && (
                    <span className="text-lg font-semibold text-foreground">{company.minUnits}</span>
                  )}
                </div>
              </div>

              <Button className="w-full bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors">
                Invest
              </Button>
            </Card>
          ))}
        </div>

        {/* CTA Button */}
        <div className="flex justify-center">
          <Button
            size="lg"
            variant="outline"
            className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-6 h-auto rounded-full"
            asChild
          >
            <Link href="/companies">Explore All Companies</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
