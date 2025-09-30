"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Building2,
  TrendingUp,
  MapPin,
  Calendar,
  Search,
  Filter,
  ExternalLink,
  ArrowRight,
  Users,
  Target,
  Award,
} from "lucide-react"
import Link from "next/link"

const showcaseCompanies = [
  {
    id: "1",
    name: "TechVenture Solutions Pvt Ltd",
    logo: "/tech-company-logo.jpg",
    industry: "Technology",
    location: "Pune, Maharashtra",
    yearIncorporated: "2020",
    website: "www.techventure.com",
    description:
      "Leading SaaS platform for enterprise resource planning with AI-powered analytics and automation capabilities serving Fortune 500 companies.",
    lastYearSales: "₹2.5 Crores",
    currentYearProjection: "₹5 Crores",
    sharesOffered: "100,000",
    pricePerShare: "₹500",
    totalAmount: "₹5 Crores",
    minInvestment: "₹50 Lakhs",
    stage: "Series A",
    purpose: "Product development and market expansion",
    highlights: ["40% YoY Growth", "200+ Enterprise Clients", "Profitable", "AI-Powered"],
    employees: "150+",
    customers: "200+",
    featured: true,
    approved: true,
    listingType: "premium",
  },
  {
    id: "2",
    name: "HealthCare Innovations Ltd",
    logo: "/healthcare-medical-logo.jpg",
    industry: "Healthcare",
    location: "Delhi, NCR",
    yearIncorporated: "2019",
    website: "www.healthcareinnovations.com",
    description:
      "Revolutionary telemedicine platform connecting patients with specialists across India, powered by AI diagnostics and 24/7 availability.",
    lastYearSales: "₹8 Crores",
    currentYearProjection: "₹15 Crores",
    sharesOffered: "200,000",
    pricePerShare: "₹750",
    totalAmount: "₹15 Crores",
    minInvestment: "₹1 Crore",
    stage: "Series B",
    purpose: "Expansion to new cities and R&D",
    highlights: ["1M+ Users", "500+ Doctors", "85% Satisfaction", "24/7 Service"],
    employees: "300+",
    customers: "1M+",
    featured: true,
    approved: true,
    listingType: "premium",
  },
  {
    id: "3",
    name: "EduTech Learning Platform",
    logo: "/education-learning-logo.jpg",
    industry: "EdTech",
    location: "Bangalore, Karnataka",
    yearIncorporated: "2021",
    website: "www.edutechlearning.com",
    description:
      "Personalized learning platform using AI to adapt to each student's pace and learning style for K-12 education with gamified content.",
    lastYearSales: "₹1.2 Crores",
    currentYearProjection: "₹3.5 Crores",
    sharesOffered: "80,000",
    pricePerShare: "₹625",
    totalAmount: "₹5 Crores",
    minInvestment: "₹25 Lakhs",
    stage: "Seed",
    purpose: "Content development and marketing",
    highlights: ["50K+ Students", "150% Growth", "Award Winning", "Gamified"],
    employees: "80+",
    customers: "50K+",
    featured: false,
    approved: true,
    listingType: "normal",
  },
  {
    id: "4",
    name: "GreenEnergy Solutions",
    logo: "/green-energy-solar-logo.jpg",
    industry: "Renewable Energy",
    location: "Ahmedabad, Gujarat",
    yearIncorporated: "2018",
    website: "www.greenenergysolutions.com",
    description:
      "Solar energy solutions provider for residential and commercial properties with innovative financing models and government partnerships.",
    lastYearSales: "₹12 Crores",
    currentYearProjection: "₹20 Crores",
    sharesOffered: "150,000",
    pricePerShare: "₹800",
    totalAmount: "₹12 Crores",
    minInvestment: "₹75 Lakhs",
    stage: "Series A",
    purpose: "Manufacturing facility and expansion",
    highlights: ["2000+ Installations", "Carbon Neutral", "Govt Certified", "ESG Compliant"],
    employees: "200+",
    customers: "2000+",
    featured: true,
    approved: true,
    listingType: "premium",
  },
  {
    id: "5",
    name: "FinTech Payment Gateway",
    logo: "/fintech-payment-logo.jpg",
    industry: "FinTech",
    location: "Mumbai, Maharashtra",
    yearIncorporated: "2020",
    website: "www.fintechpayment.com",
    description:
      "Next-generation payment gateway with blockchain integration for secure, instant cross-border transactions with multi-currency support.",
    lastYearSales: "₹6 Crores",
    currentYearProjection: "₹12 Crores",
    sharesOffered: "120,000",
    pricePerShare: "₹1000",
    totalAmount: "₹12 Crores",
    minInvestment: "₹1 Crore",
    stage: "Series A",
    purpose: "Technology infrastructure and compliance",
    highlights: ["₹500Cr+ Processed", "99.9% Uptime", "RBI Approved", "Blockchain"],
    employees: "120+",
    customers: "5000+",
    featured: true,
    approved: true,
    listingType: "premium",
  },
  {
    id: "6",
    name: "AgriTech Farming Solutions",
    logo: "/agriculture-farming-logo.jpg",
    industry: "AgriTech",
    location: "Hyderabad, Telangana",
    yearIncorporated: "2019",
    website: "www.agritechfarming.com",
    description:
      "IoT-based precision farming solutions helping farmers optimize crop yield and reduce water consumption with real-time monitoring.",
    lastYearSales: "₹3 Crores",
    currentYearProjection: "₹7 Crores",
    sharesOffered: "100,000",
    pricePerShare: "₹400",
    totalAmount: "₹4 Crores",
    minInvestment: "₹40 Lakhs",
    stage: "Seed",
    purpose: "Product development and farmer onboarding",
    highlights: ["5000+ Farmers", "30% Yield Increase", "Water Saving", "IoT Enabled"],
    employees: "60+",
    customers: "5000+",
    featured: false,
    approved: true,
    listingType: "normal",
  },
  {
    id: "7",
    name: "E-Commerce Logistics Hub",
    logo: "/logistics-delivery-logo.jpg",
    industry: "Logistics",
    location: "Gurgaon, Haryana",
    yearIncorporated: "2020",
    website: "www.ecommercelogistics.com",
    description:
      "Last-mile delivery solutions for e-commerce with AI-powered route optimization and same-day delivery capabilities across metro cities.",
    lastYearSales: "₹10 Crores",
    currentYearProjection: "₹18 Crores",
    sharesOffered: "180,000",
    pricePerShare: "₹555",
    totalAmount: "₹10 Crores",
    minInvestment: "₹60 Lakhs",
    stage: "Series A",
    purpose: "Fleet expansion and technology upgrade",
    highlights: ["1M+ Deliveries", "Same Day Delivery", "AI Optimized", "Pan India"],
    employees: "500+",
    customers: "100+",
    featured: false,
    approved: true,
    listingType: "normal",
  },
  {
    id: "8",
    name: "FoodTech Delivery Platform",
    logo: "/food-delivery-logo.png",
    industry: "FoodTech",
    location: "Bangalore, Karnataka",
    yearIncorporated: "2021",
    website: "www.foodtechdelivery.com",
    description:
      "Cloud kitchen aggregator platform connecting home chefs with customers, promoting authentic regional cuisines with quality assurance.",
    lastYearSales: "₹4 Crores",
    currentYearProjection: "₹9 Crores",
    sharesOffered: "90,000",
    pricePerShare: "₹666",
    totalAmount: "₹6 Crores",
    minInvestment: "₹35 Lakhs",
    stage: "Seed",
    purpose: "Chef onboarding and marketing",
    highlights: ["500+ Chefs", "50K+ Orders", "Regional Cuisine", "Quality Assured"],
    employees: "100+",
    customers: "50K+",
    featured: false,
    approved: true,
    listingType: "normal",
  },
]

export default function CompaniesShowcase() {
  const [companies] = useState(showcaseCompanies.filter((c) => c.approved))
  const [searchQuery, setSearchQuery] = useState("")
  const [industryFilter, setIndustryFilter] = useState("all")
  const [stageFilter, setStageFilter] = useState("all")
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false)

  const industries = ["all", ...Array.from(new Set(showcaseCompanies.map((c) => c.industry)))]
  const stages = ["all", ...Array.from(new Set(showcaseCompanies.map((c) => c.stage)))]

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesIndustry = industryFilter === "all" || company.industry === industryFilter
    const matchesStage = stageFilter === "all" || company.stage === stageFilter
    const matchesFeatured = !showFeaturedOnly || company.featured
    return matchesSearch && matchesIndustry && matchesStage && matchesFeatured
  })

  const premiumCompanies = filteredCompanies.filter((c) => c.listingType === "premium")
  const normalCompanies = filteredCompanies.filter((c) => c.listingType === "normal")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-50">
      <Navigation />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Company Showcase</h1>
          <p className="text-xl text-center text-indigo-100 max-w-3xl mx-auto">
            Discover vetted pre-IPO companies approved by our team and ready for investment
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 -mt-12">
          <Card className="p-6 text-center border-2 shadow-lg bg-white">
            <Building2 className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
            <p className="text-3xl font-bold text-slate-900">{companies.length}</p>
            <p className="text-sm text-slate-600">Total Companies</p>
          </Card>
          <Card className="p-6 text-center border-2 shadow-lg bg-white">
            <Award className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <p className="text-3xl font-bold text-slate-900">{premiumCompanies.length}</p>
            <p className="text-sm text-slate-600">Featured</p>
          </Card>
          <Card className="p-6 text-center border-2 shadow-lg bg-white">
            <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-3xl font-bold text-slate-900">{industries.length - 1}</p>
            <p className="text-sm text-slate-600">Industries</p>
          </Card>
          <Card className="p-6 text-center border-2 shadow-lg bg-white">
            <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-3xl font-bold text-slate-900">₹78Cr+</p>
            <p className="text-sm text-slate-600">Total Raising</p>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-8 border-2">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-slate-600" />
            <h2 className="font-semibold text-slate-900">Filter Companies</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-2"
              />
            </div>

            {/* Industry Filter */}
            <Select value={industryFilter} onValueChange={setIndustryFilter}>
              <SelectTrigger className="border-2">
                <SelectValue placeholder="Select Industry" />
              </SelectTrigger>
              <SelectContent>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry === "all" ? "All Industries" : industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Stage Filter */}
            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger className="border-2">
                <SelectValue placeholder="Select Stage" />
              </SelectTrigger>
              <SelectContent>
                {stages.map((stage) => (
                  <SelectItem key={stage} value={stage}>
                    {stage === "all" ? "All Stages" : stage}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm flex-wrap gap-3">
            <div className="flex items-center gap-4">
              <p className="text-slate-600">
                Showing <strong>{filteredCompanies.length}</strong> of <strong>{companies.length}</strong> companies
              </p>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showFeaturedOnly}
                  onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                  className="w-4 h-4 rounded border-2 border-slate-300"
                />
                <span className="text-slate-700">Featured only</span>
              </label>
            </div>
            {(searchQuery || industryFilter !== "all" || stageFilter !== "all" || showFeaturedOnly) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("")
                  setIndustryFilter("all")
                  setStageFilter("all")
                  setShowFeaturedOnly(false)
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </Card>

        {premiumCompanies.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-2 rounded-full">
                <Award className="w-5 h-5" />
                <span className="font-semibold">Premium Listings</span>
              </div>
              <p className="text-slate-600">Featured companies with enhanced visibility</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {premiumCompanies.map((company) => (
                <Card key={company.id} className="p-6 border-2 hover:shadow-xl transition-all relative">
                  {/* Featured Badge */}
                  {company.featured && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0">
                        <Award className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    </div>
                  )}

                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full border-2 border-indigo-200 overflow-hidden bg-white flex-shrink-0 shadow-md">
                      <img
                        src={company.logo || "/placeholder.svg"}
                        alt={`${company.name} logo`}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Header */}
                    <div className="flex-1 pr-16">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{company.name}</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-indigo-100 text-indigo-700 border-indigo-300 border-2">
                          {company.industry}
                        </Badge>
                        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-300 border-2">
                          {company.stage}
                        </Badge>
                      </div>
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

                  {/* Company Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-4 bg-slate-50 p-4 rounded-lg border-2 border-slate-200">
                    <div className="text-center">
                      <Users className="w-4 h-4 text-slate-600 mx-auto mb-1" />
                      <p className="text-xs text-slate-600 mb-1">Employees</p>
                      <p className="text-sm font-bold text-slate-900">{company.employees}</p>
                    </div>
                    <div className="text-center">
                      <Target className="w-4 h-4 text-slate-600 mx-auto mb-1" />
                      <p className="text-xs text-slate-600 mb-1">Customers</p>
                      <p className="text-sm font-bold text-slate-900">{company.customers}</p>
                    </div>
                    <div className="text-center">
                      <Calendar className="w-4 h-4 text-slate-600 mx-auto mb-1" />
                      <p className="text-xs text-slate-600 mb-1">Founded</p>
                      <p className="text-sm font-bold text-slate-900">{company.yearIncorporated}</p>
                    </div>
                  </div>

                  {/* Location & Performance */}
                  <div className="grid grid-cols-2 gap-3 mb-4 bg-slate-50 p-4 rounded-lg border-2 border-slate-200">
                    <div>
                      <p className="text-xs text-slate-600 mb-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        Location
                      </p>
                      <p className="text-sm font-medium text-slate-900">{company.location.split(",")[0]}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 mb-1 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        Last Year Sales
                      </p>
                      <p className="text-sm font-medium text-slate-900">{company.lastYearSales}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 mb-1">Current Year Projection</p>
                      <p className="text-sm font-medium text-slate-900">{company.currentYearProjection}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 mb-1">Website</p>
                      <a
                        href={`https://${company.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-indigo-600 hover:underline flex items-center gap-1"
                      >
                        Visit <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  {/* Funding Details */}
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-lg mb-4 border-2 border-indigo-200">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-slate-600 mb-1">Total Raising</p>
                        <p className="text-xl font-bold text-slate-900">{company.totalAmount}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 mb-1">Min. Investment</p>
                        <p className="text-xl font-bold text-slate-900">{company.minInvestment}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs text-slate-600 mb-1">Share Details</p>
                        <p className="text-sm font-medium text-slate-900">
                          {company.pricePerShare} × {company.sharesOffered} shares
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Purpose */}
                  <div className="mb-4 p-3 bg-slate-50 rounded-lg border-2 border-slate-200">
                    <p className="text-xs text-slate-600 mb-1">Use of Funds</p>
                    <p className="text-sm text-slate-700">{company.purpose}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                      View Details
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Button variant="outline" className="border-2 bg-transparent" asChild>
                      <a href={`https://${company.website}`} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {normalCompanies.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl font-bold text-slate-900">All Companies</h2>
              <Badge variant="secondary" className="border-2">
                {normalCompanies.length} companies
              </Badge>
            </div>

            {filteredCompanies.length === 0 ? (
              <Card className="p-12 text-center border-2">
                <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No companies found</h3>
                <p className="text-slate-600">Try adjusting your filters to see more results</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {normalCompanies.map((company) => (
                  <Card key={company.id} className="p-6 border-2 hover:shadow-xl transition-all relative">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 rounded-full border-2 border-indigo-200 overflow-hidden bg-white flex-shrink-0 shadow-md">
                        <img
                          src={company.logo || "/placeholder.svg"}
                          alt={`${company.name} logo`}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-900 mb-2">{company.name}</h3>
                        <div className="flex flex-wrap gap-2">
                          <Badge className="bg-indigo-100 text-indigo-700 border-indigo-300 border-2">
                            {company.industry}
                          </Badge>
                          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-300 border-2">
                            {company.stage}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 mb-4 leading-relaxed">{company.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {company.highlights.map((highlight, idx) => (
                        <Badge key={idx} variant="secondary" className="border-2">
                          {highlight}
                        </Badge>
                      ))}
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-4 bg-slate-50 p-4 rounded-lg border-2 border-slate-200">
                      <div className="text-center">
                        <Users className="w-4 h-4 text-slate-600 mx-auto mb-1" />
                        <p className="text-xs text-slate-600 mb-1">Employees</p>
                        <p className="text-sm font-bold text-slate-900">{company.employees}</p>
                      </div>
                      <div className="text-center">
                        <Target className="w-4 h-4 text-slate-600 mx-auto mb-1" />
                        <p className="text-xs text-slate-600 mb-1">Customers</p>
                        <p className="text-sm font-bold text-slate-900">{company.customers}</p>
                      </div>
                      <div className="text-center">
                        <Calendar className="w-4 h-4 text-slate-600 mx-auto mb-1" />
                        <p className="text-xs text-slate-600 mb-1">Founded</p>
                        <p className="text-sm font-bold text-slate-900">{company.yearIncorporated}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4 bg-slate-50 p-4 rounded-lg border-2 border-slate-200">
                      <div>
                        <p className="text-xs text-slate-600 mb-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          Location
                        </p>
                        <p className="text-sm font-medium text-slate-900">{company.location.split(",")[0]}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 mb-1 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          Last Year Sales
                        </p>
                        <p className="text-sm font-medium text-slate-900">{company.lastYearSales}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 mb-1">Current Year Projection</p>
                        <p className="text-sm font-medium text-slate-900">{company.currentYearProjection}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 mb-1">Website</p>
                        <a
                          href={`https://${company.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-indigo-600 hover:underline flex items-center gap-1"
                        >
                          Visit <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-lg mb-4 border-2 border-indigo-200">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-slate-600 mb-1">Total Raising</p>
                          <p className="text-xl font-bold text-slate-900">{company.totalAmount}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600 mb-1">Min. Investment</p>
                          <p className="text-xl font-bold text-slate-900">{company.minInvestment}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-xs text-slate-600 mb-1">Share Details</p>
                          <p className="text-sm font-medium text-slate-900">
                            {company.pricePerShare} × {company.sharesOffered} shares
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4 p-3 bg-slate-50 rounded-lg border-2 border-slate-200">
                      <p className="text-xs text-slate-600 mb-1">Use of Funds</p>
                      <p className="text-sm text-slate-700">{company.purpose}</p>
                    </div>

                    <div className="flex gap-3">
                      <Button className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                        View Details
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                      <Button variant="outline" className="border-2 bg-transparent" asChild>
                        <a href={`https://${company.website}`} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CTA Section */}
        <Card className="mt-12 p-8 text-center bg-gradient-to-r from-indigo-600 to-purple-600 border-0">
          <h3 className="text-2xl font-bold text-white mb-3">Ready to Start Investing?</h3>
          <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
            Join our platform to access exclusive pre-IPO investment opportunities from vetted companies
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-indigo-600 hover:bg-slate-100">
              <Link href="/register">Sign Up as Investor</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 bg-transparent"
            >
              <Link href="/company-registration">List Your Company</Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
