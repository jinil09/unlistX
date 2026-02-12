"use client"

import { useState, useEffect } from "react"
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
  RefreshCw,
} from "lucide-react"
import Link from "next/link"

interface Company {
  id: string;
  company_name: string;
  logo_filename: string;
  industry: string;
  registered_address: string;
  year_of_incorporation: string;
  website: string;
  about_company: string;
  previous_sales: string;
  future_projections: string;
  shares_offered: string;
  price_per_share: string;
  total_amount: string;
  purpose_of_fundraising: string;
  listing_type: "normal" | "premium";
  status: "pending" | "approved" | "rejected";
  contact_person: string;
  email: string;
  mobile: string;
  created_at: string;
}

interface ApiResponse {
  success: boolean;
  data?: Company[];
  error?: string;
}

export default function CompaniesShowcase() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [industryFilter, setIndustryFilter] = useState("all")
  const [listingTypeFilter, setListingTypeFilter] = useState("all")

  // Fetch companies from API
  const fetchCompanies = async () => {
    try {
      setRefreshing(true)
      const response = await fetch('/api/companies?status=approved')
      const result: ApiResponse = await response.json()

      if (result.success && result.data) {
        setCompanies(result.data)
      } else {
        console.error('Failed to fetch companies:', result.error)
      }
    } catch (error) {
      console.error('Error fetching companies:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchCompanies()
  }, [])

  // Get unique industries for filter
  const industries = ["all", ...Array.from(new Set(companies.map((c) => c.industry)))]

  // Filter companies based on search and filters
  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.about_company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.industry.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesIndustry = industryFilter === "all" || company.industry === industryFilter
    const matchesListingType = listingTypeFilter === "all" || company.listing_type === listingTypeFilter
    
    return matchesSearch && matchesIndustry && matchesListingType
  })

  const premiumCompanies = filteredCompanies.filter((c) => c.listing_type === "premium")
  const normalCompanies = filteredCompanies.filter((c) => c.listing_type === "normal")

  // Helper function to generate highlights based on company data
  const generateHighlights = (company: Company) => {
    const highlights = []
    
    // Add industry-specific highlights
    if (company.industry.toLowerCase().includes('tech')) {
      highlights.push('Tech Innovation')
    }
    if (company.industry.toLowerCase().includes('health')) {
      highlights.push('Healthcare Focus')
    }
    if (company.industry.toLowerCase().includes('energy')) {
      highlights.push('Sustainable')
    }
    
    // Add performance highlights based on sales data
    if (company.previous_sales && company.previous_sales.includes('Cr')) {
      highlights.push('Strong Revenue')
    }
    
    // Add growth potential
    if (company.future_projections && company.future_projections.includes('Cr')) {
      highlights.push('High Growth')
    }
    
    // Add listing type highlight
    if (company.listing_type === 'premium') {
      highlights.push('Premium Listing')
    }
    
    // Ensure we have at least 2 highlights
    if (highlights.length < 2) {
      highlights.push('Verified', 'Pre-IPO')
    }
    
    return highlights.slice(0, 4) // Max 4 highlights
  }

  // Helper function to get location from address
  const getLocation = (address: string) => {
    const parts = address.split(',')
    if (parts.length >= 2) {
      return `${parts[0]}, ${parts[parts.length - 2]}`
    }
    return address
  }

  // Helper function to format financial data
  const formatFinancialData = (data: string) => {
    if (!data) return 'Not Available'
    // Extract numbers and format
    const match = data.match(/(\d+\.?\d*)\s*(Cr|Lakh|L)/i)
    if (match) {
      return `₹${match[1]} ${match[2].toLowerCase().includes('cr') ? 'Crores' : 'Lakhs'}`
    }
    return data
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading companies...</p>
        </div>
      </div>
    )
  }

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
            <p className="text-3xl font-bold text-slate-900">
              ₹{companies.reduce((total, company) => {
                const amount = company.total_amount ? parseFloat(company.total_amount.replace(/[^0-9.]/g, '')) : 0
                return total + amount
              }, 0).toFixed(1)}Cr+
            </p>
            <p className="text-sm text-slate-600">Total Raising</p>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-8 border-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-slate-600" />
              <h2 className="font-semibold text-slate-900">Filter Companies</h2>
            </div>
            <Button 
              onClick={fetchCompanies} 
              variant="outline" 
              size="sm"
              disabled={refreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
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

            {/* Listing Type Filter */}
            <Select value={listingTypeFilter} onValueChange={setListingTypeFilter}>
              <SelectTrigger className="border-2">
                <SelectValue placeholder="Listing Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm flex-wrap gap-3">
            <div className="flex items-center gap-4">
              <p className="text-slate-600">
                Showing <strong>{filteredCompanies.length}</strong> of <strong>{companies.length}</strong> companies
              </p>
            </div>
            {(searchQuery || industryFilter !== "all" || listingTypeFilter !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("")
                  setIndustryFilter("all")
                  setListingTypeFilter("all")
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
                <CompanyCard 
                  key={company.id} 
                  company={company} 
                  highlights={generateHighlights(company)}
                  location={getLocation(company.registered_address)}
                />
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
                  <CompanyCard 
                    key={company.id} 
                    company={company} 
                    highlights={generateHighlights(company)}
                    location={getLocation(company.registered_address)}
                  />
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

// Separate Company Card Component for better organization
interface CompanyCardProps {
  company: Company
  highlights: string[]
  location: string
}

function CompanyCard({ company, highlights, location }: CompanyCardProps) {
  return (
    <Card className="p-6 border-2 hover:shadow-xl transition-all relative">
      {/* Featured Badge for Premium Listings */}
      {company.listing_type === "premium" && (
        <div className="absolute top-4 right-4">
          <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0">
            <Award className="w-3 h-3 mr-1" />
            Featured
          </Badge>
        </div>
      )}

      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 rounded-full border-2 border-indigo-200 overflow-hidden bg-white flex-shrink-0 shadow-md flex items-center justify-center">
          {company.logo_filename ? (
            <img
              src={`/uploads/${company.logo_filename}`}
              alt={`${company.company_name} logo`}
              className="w-full h-full object-cover"
            />
          ) : (
            <Building2 className="w-8 h-8 text-indigo-400" />
          )}
        </div>

        {/* Header */}
        <div className="flex-1 pr-16">
          <h3 className="text-xl font-bold text-slate-900 mb-2">{company.company_name}</h3>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-indigo-100 text-indigo-700 border-indigo-300 border-2">
              {company.industry}
            </Badge>
            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-300 border-2">
              {company.listing_type === 'premium' ? 'Premium' : 'Standard'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-600 mb-4 leading-relaxed">{company.about_company}</p>

      {/* Highlights */}
      <div className="flex flex-wrap gap-2 mb-4">
        {highlights.map((highlight, idx) => (
          <Badge key={idx} variant="secondary" className="border-2">
            {highlight}
          </Badge>
        ))}
      </div>

      {/* Company Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4 bg-slate-50 p-4 rounded-lg border-2 border-slate-200">
        <div className="text-center">
          <Users className="w-4 h-4 text-slate-600 mx-auto mb-1" />
          <p className="text-xs text-slate-600 mb-1">Founded</p>
          <p className="text-sm font-bold text-slate-900">{company.year_of_incorporation}</p>
        </div>
        <div className="text-center">
          <Target className="w-4 h-4 text-slate-600 mx-auto mb-1" />
          <p className="text-xs text-slate-600 mb-1">Contact</p>
          <p className="text-sm font-bold text-slate-900">{company.contact_person.split(' ')[0]}</p>
        </div>
        <div className="text-center">
          <Calendar className="w-4 h-4 text-slate-600 mx-auto mb-1" />
          <p className="text-xs text-slate-600 mb-1">Status</p>
          <p className="text-sm font-bold text-slate-900">Approved</p>
        </div>
      </div>

      {/* Location & Performance */}
      <div className="grid grid-cols-2 gap-3 mb-4 bg-slate-50 p-4 rounded-lg border-2 border-slate-200">
        <div>
          <p className="text-xs text-slate-600 mb-1 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            Location
          </p>
          <p className="text-sm font-medium text-slate-900">{location}</p>
        </div>
        <div>
          <p className="text-xs text-slate-600 mb-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Previous Sales
          </p>
          <p className="text-sm font-medium text-slate-900">
            {formatFinancialData(company.previous_sales)}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-600 mb-1">Future Projections</p>
          <p className="text-sm font-medium text-slate-900">
            {formatFinancialData(company.future_projections)}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-600 mb-1">Contact</p>
          <p className="text-sm font-medium text-indigo-600">
            {company.email}
          </p>
        </div>
      </div>

      {/* Funding Details */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-lg mb-4 border-2 border-indigo-200">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-slate-600 mb-1">Total Raising</p>
            <p className="text-xl font-bold text-slate-900">
              {formatFinancialData(company.total_amount)}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-600 mb-1">Price per Share</p>
            <p className="text-xl font-bold text-slate-900">
              {company.price_per_share}
            </p>
          </div>
          <div className="col-span-2">
            <p className="text-xs text-slate-600 mb-1">Share Details</p>
            <p className="text-sm font-medium text-slate-900">
              {company.price_per_share} × {company.shares_offered} shares
            </p>
          </div>
        </div>
      </div>

      {/* Purpose */}
      <div className="mb-4 p-3 bg-slate-50 rounded-lg border-2 border-slate-200">
        <p className="text-xs text-slate-600 mb-1">Use of Funds</p>
        <p className="text-sm text-slate-700">{company.purpose_of_fundraising}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
          View Details
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
        {company.website && (
          <Button variant="outline" className="border-2 bg-transparent" asChild>
            <a href={`https://${company.website}`} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
        )}
      </div>
    </Card>
  )
}

// Helper function to format financial data
function formatFinancialData(data: string) {
  if (!data) return 'Not Available'
  // Extract numbers and format
  const match = data.match(/(\d+\.?\d*)\s*(Cr|Lakh|L)/i)
  if (match) {
    return `₹${match[1]} ${match[2].toLowerCase().includes('cr') ? 'Crores' : 'Lakhs'}`
  }
  return data
}