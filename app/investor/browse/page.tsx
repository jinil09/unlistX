"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, TrendingUp, MapPin, Calendar, Search, Filter, ExternalLink, Heart, ArrowRight } from "lucide-react"

// Mock data for approved companies
const mockCompanies = [
  {
    id: "1",
    name: "TechVenture Solutions Pvt Ltd",
    logo: "/tech-company-logo.jpg",
    industry: "Technology",
    location: "Pune, Maharashtra",
    yearIncorporated: "2020",
    website: "www.techventure.com",
    description:
      "Leading SaaS platform for enterprise resource planning with AI-powered analytics and automation capabilities.",
    lastYearSales: "₹2.5 Crores",
    currentYearProjection: "₹5 Crores",
    sharesOffered: "100,000",
    pricePerShare: "₹500",
    totalAmount: "₹5 Crores",
    minInvestment: "₹50 Lakhs",
    stage: "Series A",
    purpose: "Product development and market expansion",
    highlights: ["40% YoY Growth", "200+ Enterprise Clients", "Profitable"],
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
      "Revolutionary telemedicine platform connecting patients with specialists across India, powered by AI diagnostics.",
    lastYearSales: "₹8 Crores",
    currentYearProjection: "₹15 Crores",
    sharesOffered: "200,000",
    pricePerShare: "₹750",
    totalAmount: "₹15 Crores",
    minInvestment: "₹1 Crore",
    stage: "Series B",
    purpose: "Expansion to new cities and R&D",
    highlights: ["1M+ Users", "500+ Doctors", "85% Customer Satisfaction"],
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
      "Personalized learning platform using AI to adapt to each student's pace and learning style for K-12 education.",
    lastYearSales: "₹1.2 Crores",
    currentYearProjection: "₹3.5 Crores",
    sharesOffered: "80,000",
    pricePerShare: "₹625",
    totalAmount: "₹5 Crores",
    minInvestment: "₹25 Lakhs",
    stage: "Seed",
    purpose: "Content development and marketing",
    highlights: ["50K+ Students", "150% Growth", "Award Winning"],
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
      "Solar energy solutions provider for residential and commercial properties with innovative financing models.",
    lastYearSales: "₹12 Crores",
    currentYearProjection: "₹20 Crores",
    sharesOffered: "150,000",
    pricePerShare: "₹800",
    totalAmount: "₹12 Crores",
    minInvestment: "₹75 Lakhs",
    stage: "Series A",
    purpose: "Manufacturing facility and expansion",
    highlights: ["2000+ Installations", "Carbon Neutral", "Government Certified"],
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
      "Next-generation payment gateway with blockchain integration for secure, instant cross-border transactions.",
    lastYearSales: "₹6 Crores",
    currentYearProjection: "₹12 Crores",
    sharesOffered: "120,000",
    pricePerShare: "₹1000",
    totalAmount: "₹12 Crores",
    minInvestment: "₹1 Crore",
    stage: "Series A",
    purpose: "Technology infrastructure and compliance",
    highlights: ["₹500Cr+ Processed", "99.9% Uptime", "RBI Approved"],
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
      "IoT-based precision farming solutions helping farmers optimize crop yield and reduce water consumption.",
    lastYearSales: "₹3 Crores",
    currentYearProjection: "₹7 Crores",
    sharesOffered: "100,000",
    pricePerShare: "₹400",
    totalAmount: "₹4 Crores",
    minInvestment: "₹40 Lakhs",
    stage: "Seed",
    purpose: "Product development and farmer onboarding",
    highlights: ["5000+ Farmers", "30% Yield Increase", "Water Saving"],
  },
]

export default function InvestorBrowsePage() {
  const [companies, setCompanies] = useState(mockCompanies)
  const [searchQuery, setSearchQuery] = useState("")
  const [industryFilter, setIndustryFilter] = useState("all")
  const [stageFilter, setStageFilter] = useState("all")
  const [savedCompanies, setSavedCompanies] = useState<string[]>([])

  const industries = ["all", ...Array.from(new Set(mockCompanies.map((c) => c.industry)))]
  const stages = ["all", ...Array.from(new Set(mockCompanies.map((c) => c.stage)))]

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesIndustry = industryFilter === "all" || company.industry === industryFilter
    const matchesStage = stageFilter === "all" || company.stage === stageFilter
    return matchesSearch && matchesIndustry && matchesStage
  })

  const toggleSave = (id: string) => {
    setSavedCompanies((prev) => (prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Browse Investment Opportunities
          </h1>
          <p className="text-slate-600">Discover pre-IPO companies seeking funding</p>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-8 border-2">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-slate-600" />
            <h2 className="font-semibold text-slate-900">Filter Companies</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
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

          <div className="mt-4 flex items-center justify-between text-sm">
            <p className="text-slate-600">
              Showing <strong>{filteredCompanies.length}</strong> of <strong>{companies.length}</strong> companies
            </p>
            {(searchQuery || industryFilter !== "all" || stageFilter !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("")
                  setIndustryFilter("all")
                  setStageFilter("all")
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </Card>

        {/* Companies Grid */}
        {filteredCompanies.length === 0 ? (
          <Card className="p-12 text-center border-2">
            <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No companies found</h3>
            <p className="text-slate-600">Try adjusting your filters to see more results</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCompanies.map((company) => (
              <Card key={company.id} className="p-6 border-2 hover:shadow-lg transition-all">
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full border-2 border-blue-200 overflow-hidden bg-white flex-shrink-0 shadow-md">
                    <img
                      src={company.logo || "/placeholder.svg"}
                      alt={`${company.name} logo`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-slate-900">{company.name}</h3>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => toggleSave(company.id)}>
                        <Heart
                          className={`w-5 h-5 ${
                            savedCompanies.includes(company.id) ? "fill-red-500 text-red-500" : "text-slate-400"
                          }`}
                        />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge className="bg-blue-100 text-blue-700 border-blue-300 border-2">{company.industry}</Badge>
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

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4 bg-slate-50 p-4 rounded-lg border-2 border-slate-200">
                  <div>
                    <p className="text-xs text-slate-600 mb-1">Location</p>
                    <p className="text-sm font-medium text-slate-900 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {company.location.split(",")[0]}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 mb-1">Founded</p>
                    <p className="text-sm font-medium text-slate-900 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {company.yearIncorporated}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 mb-1">Last Year Sales</p>
                    <p className="text-sm font-medium text-slate-900 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {company.lastYearSales}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 mb-1">Projection</p>
                    <p className="text-sm font-medium text-slate-900 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {company.currentYearProjection}
                    </p>
                  </div>
                </div>

                {/* Funding Details */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg mb-4 border-2 border-blue-200">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-slate-600 mb-1">Raising</p>
                      <p className="text-lg font-bold text-slate-900">{company.totalAmount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 mb-1">Min. Investment</p>
                      <p className="text-lg font-bold text-slate-900">{company.minInvestment}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-slate-600 mb-1">Share Price</p>
                      <p className="text-sm font-medium text-slate-900">
                        {company.pricePerShare} × {company.sharesOffered} shares
                      </p>
                    </div>
                  </div>
                </div>

                {/* Purpose */}
                <div className="mb-4">
                  <p className="text-xs text-slate-600 mb-1">Use of Funds</p>
                  <p className="text-sm text-slate-700">{company.purpose}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    Express Interest
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
    </div>
  )
}
