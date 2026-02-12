"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Building2,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  TrendingUp,
  LogOut,
  RefreshCw,
} from "lucide-react"

interface Investor {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  investorType: string;
  netWorth: string;
  investmentRange: string;
  experience: string;
  sectors: string[];
  stages: string[];
  submittedDate: string;
  status: string;
}

interface Company {
  id: string;
  companyName: string;
  email: string;
  phone: string;
  location: string;
  industry: string;
  yearIncorporated: string;
  website: string;
  lastYearSales: string;
  currentYearProjection: string;
  sharesOffered: string;
  pricePerShare: string;
  totalAmount: string;
  purpose: string;
  listingType: "normal" | "premium";
  feeWaived: boolean;
  submittedDate: string;
  status: string;
}

interface Seller {
  id: string;
  name: string;
  email: string;
  phone: string;
  bankName: string;
  accountNumber: string;
  reason: string;
  urgency: string;
  totalHoldings: number;
  totalValue: string;
  submittedDate: string;
  status: string;
}

export default function AdminDashboard() {
  const router = useRouter()
  const [investors, setInvestors] = useState<Investor[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [sellers, setSellers] = useState<Seller[]>([])
  const [selectedInvestor, setSelectedInvestor] = useState<string | null>(null)
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null)
  const [selectedSeller, setSelectedSeller] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // Fetch all data
  const fetchData = async () => {
    try {
      setRefreshing(true)
      
      const [investorsRes, companiesRes, sellersRes] = await Promise.all([
        fetch('/api/admin/investors?status=pending'),
        fetch('/api/admin/companies?status=pending'),
        fetch('/api/admin/sellers?status=pending')
      ])

      const investorsData = await investorsRes.json()
      const companiesData = await companiesRes.json()
      console.log('companiesData Response:', companiesData)
      const sellersData = await sellersRes.json()

      if (investorsData.success) setInvestors(investorsData.data)
      if (companiesData.success) setCompanies(companiesData.data)
      if (sellersData.success) setSellers(sellersData.data)

    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" })
      router.push("/admin/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const handleInvestorAction = async (id: string, action: "approve" | "reject") => {
    try {
      const response = await fetch('/api/admin/investors', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id, 
          status: action === 'approve' ? 'approved' : 'rejected',
          adminNotes: `${action === 'approve' ? 'Approved' : 'Rejected'} by admin`
        })
      })

      const result = await response.json()

      if (result.success) {
        setInvestors(investors.filter((inv) => inv.id !== id))
        setSelectedInvestor(null)
      } else {
        console.error('Failed to update investor:', result.error)
      }
    } catch (error) {
      console.error('Error updating investor:', error)
    }
  }

  const handleCompanyAction = async (id: string, action: "approve" | "reject") => {
    try {
      const company = companies.find(comp => comp.id === id)
      const response = await fetch('/api/admin/companies', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id, 
          status: action === 'approve' ? 'approved' : 'rejected',
          listingType: company?.listingType || 'normal',
          adminNotes: `${action === 'approve' ? 'Approved' : 'Rejected'} by admin`
        })
      })

      const result = await response.json()

      if (result.success) {
        setCompanies(companies.filter((comp) => comp.id !== id))
        setSelectedCompany(null)
      } else {
        console.error('Failed to update company:', result.error)
      }
    } catch (error) {
      console.error('Error updating company:', error)
    }
  }

  const handleSellerAction = async (id: string, action: "approve" | "reject") => {
    try {
      const response = await fetch('/api/admin/sellers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id, 
          status: action === 'approve' ? 'approved' : 'rejected',
          adminNotes: `${action === 'approve' ? 'Approved' : 'Rejected'} by admin`
        })
      })

      const result = await response.json()

      if (result.success) {
        setSellers(sellers.filter((seller) => seller.id !== id))
        setSelectedSeller(null)
      } else {
        console.error('Failed to update seller:', result.error)
      }
    } catch (error) {
      console.error('Error updating seller:', error)
    }
  }

  const handleListingTypeChange = (id: string, listingType: "normal" | "premium") => {
    setCompanies(companies.map((comp) => 
      comp.id === id ? { ...comp, listingType } : comp
    ))
  }

  const handleFeeWaiverToggle = (id: string) => {
    setCompanies(companies.map((comp) => 
      comp.id === id ? { ...comp, feeWaived: !comp.feeWaived } : comp
    ))
  }

  const selectedInvestorData = investors.find((inv) => inv.id === selectedInvestor)
  const selectedCompanyData = companies.find((comp) => comp.id === selectedCompany)
  const selectedSellerData = sellers.find((seller) => seller.id === selectedSeller)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading dashboard...</p>
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
              Admin Dashboard
            </h1>
            <p className="text-slate-600">Review and manage pending registrations</p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              onClick={fetchData} 
              variant="outline" 
              disabled={refreshing}
              className="border-2 bg-transparent"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={handleLogout} variant="outline" className="border-2 bg-transparent">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 border-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Pending Investors</p>
                <p className="text-3xl font-bold text-slate-900">{investors.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Pending Companies</p>
                <p className="text-3xl font-bold text-slate-900">{companies.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Pending Sellers</p>
                <p className="text-3xl font-bold text-slate-900">{sellers.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Total Pending</p>
                <p className="text-3xl font-bold text-slate-900">{investors.length + companies.length + sellers.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="investors" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3 border-2">
            <TabsTrigger
              value="investors"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white"
            >
              Investors ({investors.length})
            </TabsTrigger>
            <TabsTrigger
              value="companies"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-teal-600 data-[state=active]:text-white"
            >
              Companies ({companies.length})
            </TabsTrigger>
            <TabsTrigger
              value="sellers"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white"
            >
              Sellers ({sellers.length})
            </TabsTrigger>
          </TabsList>

          {/* Investors Tab */}
          <TabsContent value="investors">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* List */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-slate-900">Pending Investors</h2>
                {investors.length === 0 ? (
                  <Card className="p-8 text-center border-2">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                    <p className="text-slate-600">No pending investor registrations</p>
                  </Card>
                ) : (
                  investors.map((investor) => (
                    <Card
                      key={investor.id}
                      className={`p-6 border-2 cursor-pointer transition-all hover:shadow-lg ${
                        selectedInvestor === investor.id ? "ring-2 ring-blue-500 border-blue-500" : ""
                      }`}
                      onClick={() => setSelectedInvestor(investor.id)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg text-slate-900">{investor.name}</h3>
                          <p className="text-sm text-slate-600">{investor.investorType}</p>
                        </div>
                        <Badge className="bg-amber-100 text-amber-700 border-amber-300 border-2">
                          <Clock className="w-3 h-3 mr-1" />
                          Pending
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Mail className="w-4 h-4" />
                          {investor.email}
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <MapPin className="w-4 h-4" />
                          {investor.location}
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Calendar className="w-4 h-4" />
                          Submitted: {investor.submittedDate}
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>

              {/* Details */}
              <div>
                {selectedInvestorData ? (
                  <Card className="p-6 border-2 sticky top-4">
                    <h2 className="text-xl font-semibold text-slate-900 mb-6">Investor Details</h2>

                    <div className="space-y-6">
                      {/* Personal Info */}
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                          <User className="w-5 h-5 text-blue-600" />
                          Personal Information
                        </h3>
                        <div className="space-y-2 text-sm bg-slate-50 p-4 rounded-lg border-2 border-slate-200">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Name:</span>
                            <span className="font-medium text-slate-900">{selectedInvestorData.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Email:</span>
                            <span className="font-medium text-slate-900">{selectedInvestorData.email}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Phone:</span>
                            <span className="font-medium text-slate-900">{selectedInvestorData.phone}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Location:</span>
                            <span className="font-medium text-slate-900">{selectedInvestorData.location}</span>
                          </div>
                        </div>
                      </div>

                      {/* Investment Profile */}
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                          <Briefcase className="w-5 h-5 text-blue-600" />
                          Investment Profile
                        </h3>
                        <div className="space-y-2 text-sm bg-slate-50 p-4 rounded-lg border-2 border-slate-200">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Type:</span>
                            <span className="font-medium text-slate-900">{selectedInvestorData.investorType}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Net Worth:</span>
                            <span className="font-medium text-slate-900">{selectedInvestorData.netWorth}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Investment Range:</span>
                            <span className="font-medium text-slate-900">{selectedInvestorData.investmentRange}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Experience:</span>
                            <span className="font-medium text-slate-900">{selectedInvestorData.experience}</span>
                          </div>
                        </div>
                      </div>

                      {/* Interests */}
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-blue-600" />
                          Areas of Interest
                        </h3>
                        <div className="space-y-3 bg-slate-50 p-4 rounded-lg border-2 border-slate-200">
                          <div>
                            <p className="text-sm text-slate-600 mb-2">Sectors:</p>
                            <div className="flex flex-wrap gap-2">
                              {selectedInvestorData.sectors.map((sector) => (
                                <Badge key={sector} variant="secondary" className="border-2">
                                  {sector}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-slate-600 mb-2">Investment Stages:</p>
                            <div className="flex flex-wrap gap-2">
                              {selectedInvestorData.stages.map((stage) => (
                                <Badge key={stage} variant="secondary" className="border-2">
                                  {stage}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3 pt-4">
                        <Button
                          onClick={() => handleInvestorAction(selectedInvestorData.id, "approve")}
                          className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleInvestorAction(selectedInvestorData.id, "reject")}
                          variant="destructive"
                          className="flex-1"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </Card>
                ) : (
                  <Card className="p-12 text-center border-2 border-dashed">
                    <User className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">Select an investor to view details</p>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Companies Tab */}
          <TabsContent value="companies">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* List */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-slate-900">Pending Companies</h2>
                {companies.length === 0 ? (
                  <Card className="p-8 text-center border-2">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                    <p className="text-slate-600">No pending company registrations</p>
                  </Card>
                ) : (
                  companies.map((company) => (
                    <Card
                      key={company.id}
                      className={`p-6 border-2 cursor-pointer transition-all hover:shadow-lg ${
                        selectedCompany === company.id ? "ring-2 ring-emerald-500 border-emerald-500" : ""
                      }`}
                      onClick={() => setSelectedCompany(company.id)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg text-slate-900">{company.companyName}</h3>
                          <p className="text-sm text-slate-600">{company.industry}</p>
                        </div>
                        <Badge className="bg-amber-100 text-amber-700 border-amber-300 border-2">
                          <Clock className="w-3 h-3 mr-1" />
                          Pending
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Mail className="w-4 h-4" />
                          {company.email}
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <MapPin className="w-4 h-4" />
                          {company.location}
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Calendar className="w-4 h-4" />
                          Submitted: {company.submittedDate}
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>

              {/* Details */}
              <div>
                {selectedCompanyData ? (
                  <Card className="p-6 border-2 sticky top-4">
                    <h2 className="text-xl font-semibold text-slate-900 mb-6">Company Details</h2>

                    <div className="space-y-6">
                      {/* Company Info */}
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                          <Building2 className="w-5 h-5 text-emerald-600" />
                          Company Information
                        </h3>
                        <div className="space-y-2 text-sm bg-slate-50 p-4 rounded-lg border-2 border-slate-200">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Name:</span>
                            <span className="font-medium text-slate-900">{selectedCompanyData.companyName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Industry:</span>
                            <span className="font-medium text-slate-900">{selectedCompanyData.industry}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Incorporated:</span>
                            <span className="font-medium text-slate-900">{selectedCompanyData.yearIncorporated}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Website:</span>
                            <span className="font-medium text-slate-900">{selectedCompanyData.website}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Location:</span>
                            <span className="font-medium text-slate-900">{selectedCompanyData.location}</span>
                          </div>
                        </div>
                      </div>

                      {/* Business Performance */}
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-emerald-600" />
                          Business Performance
                        </h3>
                        <div className="space-y-2 text-sm bg-slate-50 p-4 rounded-lg border-2 border-slate-200">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Last Year Sales:</span>
                            <span className="font-medium text-slate-900">{selectedCompanyData.lastYearSales}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Current Year Projection:</span>
                            <span className="font-medium text-slate-900">
                              {selectedCompanyData.currentYearProjection}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Fundraising */}
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                          <DollarSign className="w-5 h-5 text-emerald-600" />
                          Fundraising Details
                        </h3>
                        <div className="space-y-2 text-sm bg-slate-50 p-4 rounded-lg border-2 border-slate-200">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Shares Offered:</span>
                            <span className="font-medium text-slate-900">{selectedCompanyData.sharesOffered}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Price per Share:</span>
                            <span className="font-medium text-slate-900">{selectedCompanyData.pricePerShare}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Total Amount:</span>
                            <span className="font-medium text-slate-900 text-lg">
                              {selectedCompanyData.totalAmount}
                            </span>
                          </div>
                          <div className="pt-2 border-t-2 border-slate-300">
                            <span className="text-slate-600">Purpose:</span>
                            <p className="font-medium text-slate-900 mt-1">{selectedCompanyData.purpose}</p>
                          </div>
                        </div>
                      </div>

                      {/* Listing Options */}
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-emerald-600" />
                          Listing Options
                        </h3>
                        <div className="space-y-3 bg-slate-50 p-4 rounded-lg border-2 border-slate-200">
                          <div>
                            <Label className="text-sm text-slate-600 mb-2 block">Listing Type</Label>
                            <div className="grid grid-cols-2 gap-2">
                              <Button
                                type="button"
                                variant={selectedCompanyData.listingType === "normal" ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleListingTypeChange(selectedCompanyData.id, "normal")}
                                className={
                                  selectedCompanyData.listingType === "normal" ? "bg-blue-600 hover:bg-blue-700" : ""
                                }
                              >
                                Normal (₹5,000)
                              </Button>
                              <Button
                                type="button"
                                variant={selectedCompanyData.listingType === "premium" ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleListingTypeChange(selectedCompanyData.id, "premium")}
                                className={
                                  selectedCompanyData.listingType === "premium"
                                    ? "bg-purple-600 hover:bg-purple-700"
                                    : ""
                                }
                              >
                                Premium (₹50,000)
                              </Button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t-2 border-slate-300">
                            <div>
                              <Label className="text-sm text-slate-600">Listing Fee</Label>
                              <p className="text-lg font-bold text-slate-900">
                                {selectedCompanyData.feeWaived ? (
                                  <span className="text-emerald-600">Waived</span>
                                ) : selectedCompanyData.listingType === "premium" ? (
                                  "₹50,000"
                                ) : (
                                  "₹5,000"
                                )}
                              </p>
                            </div>
                            <Button
                              type="button"
                              variant={selectedCompanyData.feeWaived ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleFeeWaiverToggle(selectedCompanyData.id)}
                              className={selectedCompanyData.feeWaived ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                            >
                              {selectedCompanyData.feeWaived ? "Fee Waived" : "Waive Fee"}
                            </Button>
                          </div>

                          {selectedCompanyData.listingType === "premium" && (
                            <div className="pt-2 border-t-2 border-slate-300">
                              <p className="text-xs text-slate-600 mb-1">Premium Benefits:</p>
                              <ul className="text-xs text-slate-700 space-y-1">
                                <li className="flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  Featured on home page
                                </li>
                                <li className="flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  Priority in search results
                                </li>
                                <li className="flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  Email to all investors
                                </li>
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Contact */}
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                          <Phone className="w-5 h-5 text-emerald-600" />
                          Contact Information
                        </h3>
                        <div className="space-y-2 text-sm bg-slate-50 p-4 rounded-lg border-2 border-slate-200">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Email:</span>
                            <span className="font-medium text-slate-900">{selectedCompanyData.email}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Phone:</span>
                            <span className="font-medium text-slate-900">{selectedCompanyData.phone}</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3 pt-4">
                        <Button
                          onClick={() => handleCompanyAction(selectedCompanyData.id, "approve")}
                          className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleCompanyAction(selectedCompanyData.id, "reject")}
                          variant="destructive"
                          className="flex-1"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </Card>
                ) : (
                  <Card className="p-12 text-center border-2 border-dashed">
                    <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">Select a company to view details</p>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Sellers Tab */}
          <TabsContent value="sellers">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* List */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-slate-900">Pending Sellers</h2>
                {sellers.length === 0 ? (
                  <Card className="p-8 text-center border-2">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                    <p className="text-slate-600">No pending seller registrations</p>
                  </Card>
                ) : (
                  sellers.map((seller) => (
                    <Card
                      key={seller.id}
                      className={`p-6 border-2 cursor-pointer transition-all hover:shadow-lg ${
                        selectedSeller === seller.id ? "ring-2 ring-purple-500 border-purple-500" : ""
                      }`}
                      onClick={() => setSelectedSeller(seller.id)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg text-slate-900">{seller.name}</h3>
                          <p className="text-sm text-slate-600">{seller.totalHoldings} holdings</p>
                        </div>
                        <Badge className="bg-amber-100 text-amber-700 border-amber-300 border-2">
                          <Clock className="w-3 h-3 mr-1" />
                          Pending
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Mail className="w-4 h-4" />
                          {seller.email}
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <DollarSign className="w-4 h-4" />
                          Total Value: {seller.totalValue}
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Calendar className="w-4 h-4" />
                          Submitted: {seller.submittedDate}
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>

              {/* Details */}
              <div>
                {selectedSellerData ? (
                  <Card className="p-6 border-2 sticky top-4">
                    <h2 className="text-xl font-semibold text-slate-900 mb-6">Seller Details</h2>

                    <div className="space-y-6">
                      {/* Personal Info */}
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                          <User className="w-5 h-5 text-purple-600" />
                          Personal Information
                        </h3>
                        <div className="space-y-2 text-sm bg-slate-50 p-4 rounded-lg border-2 border-slate-200">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Name:</span>
                            <span className="font-medium text-slate-900">{selectedSellerData.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Email:</span>
                            <span className="font-medium text-slate-900">{selectedSellerData.email}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Phone:</span>
                            <span className="font-medium text-slate-900">{selectedSellerData.phone}</span>
                          </div>
                        </div>
                      </div>

                      {/* Bank Information */}
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                          <Building2 className="w-5 h-5 text-purple-600" />
                          Bank Information
                        </h3>
                        <div className="space-y-2 text-sm bg-slate-50 p-4 rounded-lg border-2 border-slate-200">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Bank Name:</span>
                            <span className="font-medium text-slate-900">{selectedSellerData.bankName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Account Number:</span>
                            <span className="font-medium text-slate-900">{selectedSellerData.accountNumber}</span>
                          </div>
                        </div>
                      </div>

                      {/* Selling Details */}
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                          <DollarSign className="w-5 h-5 text-purple-600" />
                          Selling Details
                        </h3>
                        <div className="space-y-2 text-sm bg-slate-50 p-4 rounded-lg border-2 border-slate-200">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Reason for Selling:</span>
                            <span className="font-medium text-slate-900">{selectedSellerData.reason}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Urgency:</span>
                            <span className="font-medium text-slate-900">{selectedSellerData.urgency}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Total Holdings:</span>
                            <span className="font-medium text-slate-900">{selectedSellerData.totalHoldings}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Total Value:</span>
                            <span className="font-medium text-slate-900 text-lg">{selectedSellerData.totalValue}</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3 pt-4">
                        <Button
                          onClick={() => handleSellerAction(selectedSellerData.id, "approve")}
                          className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleSellerAction(selectedSellerData.id, "reject")}
                          variant="destructive"
                          className="flex-1"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </Card>
                ) : (
                  <Card className="p-12 text-center border-2 border-dashed">
                    <DollarSign className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">Select a seller to view details</p>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}