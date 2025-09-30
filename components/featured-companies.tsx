"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Users, Award, ArrowRight } from "lucide-react"
import Link from "next/link"

// Mock data for premium/featured companies (approved by admin)
const featuredCompanies = [
  {
    id: "1",
    name: "TechVenture Solutions",
    logo: "/tech-company-logo.jpg",
    industry: "Technology",
    description: "Leading SaaS platform for enterprise resource planning with AI-powered analytics",
    totalRaising: "₹5 Crores",
    pricePerShare: "₹500",
    highlights: ["40% YoY Growth", "200+ Clients", "Profitable"],
    employees: "150+",
    featured: true,
  },
  {
    id: "2",
    name: "HealthCare Innovations",
    logo: "/healthcare-medical-logo.jpg",
    industry: "Healthcare",
    description: "Revolutionary telemedicine platform connecting patients with specialists across India",
    totalRaising: "₹15 Crores",
    pricePerShare: "₹750",
    highlights: ["1M+ Users", "500+ Doctors", "24/7 Service"],
    employees: "300+",
    featured: true,
  },
  {
    id: "3",
    name: "GreenEnergy Solutions",
    logo: "/green-energy-solar-logo.jpg",
    industry: "Renewable Energy",
    description: "Solar energy solutions provider with innovative financing models",
    totalRaising: "₹12 Crores",
    pricePerShare: "₹800",
    highlights: ["2000+ Installations", "Carbon Neutral", "ESG Compliant"],
    employees: "200+",
    featured: true,
  },
  {
    id: "4",
    name: "FinTech Payment Gateway",
    logo: "/fintech-payment-logo.jpg",
    industry: "FinTech",
    description: "Next-generation payment gateway with blockchain integration",
    totalRaising: "₹12 Crores",
    pricePerShare: "₹1000",
    highlights: ["₹500Cr+ Processed", "99.9% Uptime", "RBI Approved"],
    employees: "120+",
    featured: true,
  },
]

export function FeaturedCompanies() {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-2 rounded-full mb-4">
            <Award className="w-5 h-5" />
            <span className="font-semibold">Featured Companies</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">Premium Investment Opportunities</h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Discover our hand-picked selection of high-growth companies ready for investment. These premium listings
            have been thoroughly vetted by our team.
          </p>
        </div>

        {/* Featured Companies Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12 max-w-6xl mx-auto">
          {featuredCompanies.map((company) => (
            <Card
              key={company.id}
              className="p-6 border-2 hover:shadow-2xl transition-all relative overflow-hidden group"
            >
              {/* Featured Badge */}
              <div className="absolute top-4 right-4">
                <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0">
                  <Award className="w-3 h-3 mr-1" />
                  FEATURED
                </Badge>
              </div>

              {/* Company Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-full border-2 border-indigo-200 overflow-hidden bg-white flex-shrink-0 shadow-md">
                  <img
                    src={company.logo || "/placeholder.svg"}
                    alt={`${company.name} logo`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 pr-16">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{company.name}</h3>
                  <Badge className="bg-indigo-100 text-indigo-700 border-indigo-300 border-2">{company.industry}</Badge>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600 mb-4 leading-relaxed">{company.description}</p>

              {/* Highlights */}
              <div className="flex flex-wrap gap-2 mb-4">
                {company.highlights.map((highlight, idx) => (
                  <Badge key={idx} variant="secondary" className="border-2">
                    {highlight}
                  </Badge>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4 bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-lg border-2 border-indigo-200">
                <div>
                  <p className="text-xs text-slate-600 mb-1">Total Raising</p>
                  <p className="text-xl font-bold text-slate-900">{company.totalRaising}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600 mb-1">Price per Share</p>
                  <p className="text-xl font-bold text-slate-900">{company.pricePerShare}</p>
                </div>
              </div>

              {/* Team Size */}
              <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
                <Users className="w-4 h-4" />
                <span>{company.employees} employees</span>
              </div>

              {/* CTA */}
              <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 group-hover:shadow-lg transition-all">
                View Details
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Button
            size="lg"
            variant="outline"
            className="text-lg px-8 py-6 h-auto rounded-full border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white bg-transparent"
            asChild
          >
            <Link href="/companies">
              <Building2 className="w-5 h-5 mr-2" />
              Explore All Companies
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
