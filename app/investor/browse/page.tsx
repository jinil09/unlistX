"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, TrendingUp, MapPin, Calendar, Search, Filter, ExternalLink, Heart, ArrowRight, RefreshCw } from "lucide-react"

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

export default function InvestorBrowsePage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [industryFilter, setIndustryFilter] = useState("all")
  const [listingTypeFilter, setListingTypeFilter] = useState("all")
  const [savedCompanies, setSavedCompanies] = useState<string[]>([])

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

  const toggleSave = (id: string) => {
    setSavedCompanies((prev) => (prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]))
  }

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

  // Helper function to calculate minimum investment (10% of total amount)
  const calculateMinInvestment = (totalAmount: string) => {
    if (!totalAmount) return '₹10 Lakhs'
    
    const match = totalAmount.match(/(\d+\.?\d*)\s*(Cr|Lakh|L)/i)
    if (match) {
      const amount = parseFloat(match[1])
      const unit = match[2].toLowerCase()
      
      if (unit.includes('cr')) {
        const minInvestment = amount * 0.1 // 10% of total
        return `₹${minInvestment.toFixed(1)} Crores`
      } else {
        const minInvestment = amount * 0.1 // 10% of total
        return `₹${minInvestment.toFixed(1)} Lakhs`
      }
    }
    
    return '₹10 Lakhs'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading investment opportunities...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Browse Investment Opportunities
            </h1>
            <p className="text-slate-600">Discover pre-IPO companies seeking funding</p>
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
            <p className="text-slate-600">
              Showing <strong>{filteredCompanies.length}</strong> of <strong>{companies.length}</strong> companies
            </p>
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
              <CompanyCard 
                key={company.id} 
                company={company}
                highlights={generateHighlights(company)}
                location={getLocation(company.registered_address)}
                isSaved={savedCompanies.includes(company.id)}
                onSave={() => toggleSave(company.id)}
                minInvestment={calculateMinInvestment(company.total_amount)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Separate Company Card Component
interface CompanyCardProps {
  company: Company
  highlights: string[]
  location: string
  isSaved: boolean
  onSave: () => void
  minInvestment: string
}

function CompanyCard({ company, highlights, location, isSaved, onSave, minInvestment }: CompanyCardProps) {
  return (
    <Card key={company.id} className="p-6 border-2 hover:shadow-lg transition-all">
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 rounded-full border-2 border-blue-200 overflow-hidden bg-white flex-shrink-0 shadow-md flex items-center justify-center">
          {company.logo_filename ? (
            <img
              src={`/uploads/${company.logo_filename}`}
              alt={`${company.company_name} logo`}
              className="w-full h-full object-cover"
            />
          ) : (
            <Building2 className="w-8 h-8 text-blue-400" />
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-bold text-slate-900">{company.company_name}</h3>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onSave}>
              <Heart
                className={`w-5 h-5 ${
                  isSaved ? "fill-red-500 text-red-500" : "text-slate-400"
                }`}
              />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge className="bg-blue-100 text-blue-700 border-blue-300 border-2">{company.industry}</Badge>
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

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4 bg-slate-50 p-4 rounded-lg border-2 border-slate-200">
        <div>
          <p className="text-xs text-slate-600 mb-1">Location</p>
          <p className="text-sm font-medium text-slate-900 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {location}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-600 mb-1">Founded</p>
          <p className="text-sm font-medium text-slate-900 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {company.year_of_incorporation}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-600 mb-1">Last Year Sales</p>
          <p className="text-sm font-medium text-slate-900 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {formatFinancialData(company.previous_sales)}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-600 mb-1">Projection</p>
          <p className="text-sm font-medium text-slate-900 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {formatFinancialData(company.future_projections)}
          </p>
        </div>
      </div>

      {/* Funding Details */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg mb-4 border-2 border-blue-200">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-slate-600 mb-1">Raising</p>
            <p className="text-lg font-bold text-slate-900">
              {formatFinancialData(company.total_amount)}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-600 mb-1">Min. Investment</p>
            <p className="text-lg font-bold text-slate-900">{minInvestment}</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs text-slate-600 mb-1">Share Price</p>
            <p className="text-sm font-medium text-slate-900">
              {company.price_per_share} × {company.shares_offered} shares
            </p>
          </div>
        </div>
      </div>

      {/* Purpose */}
      <div className="mb-4">
        <p className="text-xs text-slate-600 mb-1">Use of Funds</p>
        <p className="text-sm text-slate-700">{company.purpose_of_fundraising}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
          Express Interest
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