"use client"

import { useState } from "react"
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
} from "lucide-react"

// Mock data for pending investor registrations
const mockInvestors = [
  {
    id: "INV001",
    name: "Rajesh Kumar",
    email: "rajesh.kumar@email.com",
    phone: "+91 98765 43210",
    location: "Mumbai, Maharashtra",
    investorType: "Individual",
    netWorth: "₹5-10 Crores",
    investmentRange: "₹50 Lakhs - ₹2 Crores",
    experience: "5+ years",
    sectors: ["Technology", "Healthcare", "FinTech"],
    stages: ["Series A", "Series B"],
    submittedDate: "2024-01-15",
    status: "pending",
  },
  {
    id: "INV002",
    name: "Priya Sharma",
    email: "priya.sharma@email.com",
    phone: "+91 98765 43211",
    location: "Bangalore, Karnataka",
    investorType: "Angel Investor",
    netWorth: "₹10+ Crores",
    investmentRange: "₹1-5 Crores",
    experience: "10+ years",
    sectors: ["SaaS", "E-commerce", "EdTech"],
    stages: ["Seed", "Series A"],
    submittedDate: "2024-01-16",
    status: "pending",
  },
]

// Mock data for pending company registrations
const mockCompanies = [
  {
    id: "COM001",
    companyName: "TechVenture Solutions Pvt Ltd",
    email: "contact@techventure.com",
    phone: "+91 98765 43212",
    location: "Pune, Maharashtra",
    industry: "Technology",
    yearIncorporated: "2020",
    website: "www.techventure.com",
    lastYearSales: "₹2.5 Crores",
    currentYearProjection: "₹5 Crores",
    sharesOffered: "100,000",
    pricePerShare: "₹500",
    totalAmount: "₹5 Crores",
    purpose: "Product development and market expansion",
    listingType: "premium" as "normal" | "premium",
    feeWaived: false,
    submittedDate: "2024-01-14",
    status: "pending",
  },
  {
    id: "COM002",
    companyName: "HealthCare Innovations Ltd",
    email: "info@healthcareinnovations.com",
    phone: "+91 98765 43213",
    location: "Delhi, NCR",
    industry: "Healthcare",
    yearIncorporated: "2019",
    website: "www.healthcareinnovations.com",
    lastYearSales: "₹8 Crores",
    currentYearProjection: "₹15 Crores",
    sharesOffered: "200,000",
    pricePerShare: "₹750",
    totalAmount: "₹15 Crores",
    purpose: "Expansion to new cities and R&D",
    listingType: "normal" as "normal" | "premium",
    feeWaived: false,
    submittedDate: "2024-01-15",
    status: "pending",
  },
]

export default function AdminDashboard() {
  const router = useRouter()
  const [investors, setInvestors] = useState(mockInvestors)
  const [companies, setCompanies] = useState(mockCompanies)
  const [selectedInvestor, setSelectedInvestor] = useState<string | null>(null)
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null)
  const [editingCompany, setEditingCompany] = useState<{
    id: string
    listingType: "normal" | "premium"
    feeWaived: boolean
  } | null>(null)

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" })
      router.push("/admin/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const handleInvestorAction = (id: string, action: "approve" | "reject") => {
    setInvestors(investors.filter((inv) => inv.id !== id))
    setSelectedInvestor(null)
    // In real app, this would call an API
    console.log(`[v0] Investor ${id} ${action}ed`)
  }

  const handleCompanyAction = (id: string, action: "approve" | "reject") => {
    setCompanies(companies.filter((comp) => comp.id !== id))
    setSelectedCompany(null)
    setEditingCompany(null)
    // In real app, this would call an API
    console.log(`[v0] Company ${id} ${action}ed`)
  }

  const handleListingTypeChange = (id: string, listingType: "normal" | "premium") => {
    setCompanies(companies.map((comp) => (comp.id === id ? { ...comp, listingType } : comp)))
    if (editingCompany?.id === id) {
      setEditingCompany({ ...editingCompany, listingType })
    }
  }

  const handleFeeWaiverToggle = (id: string) => {
    setCompanies(companies.map((comp) => (comp.id === id ? { ...comp, feeWaived: !comp.feeWaived } : comp)))
    if (editingCompany?.id === id) {
      setEditingCompany({ ...editingCompany, feeWaived: !editingCompany.feeWaived })
    }
  }

  const selectedInvestorData = investors.find((inv) => inv.id === selectedInvestor)
  const selectedCompanyData = companies.find((comp) => comp.id === selectedCompany)

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
          <Button onClick={handleLogout} variant="outline" className="border-2 bg-transparent">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
                <p className="text-sm text-slate-600 mb-1">Total Pending</p>
                <p className="text-3xl font-bold text-slate-900">{investors.length + companies.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="investors" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2 border-2">
            <TabsTrigger
              value="investors"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white"
            >
              Investor Registrations
            </TabsTrigger>
            <TabsTrigger
              value="companies"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-teal-600 data-[state=active]:text-white"
            >
              Company Registrations
            </TabsTrigger>
          </TabsList>

          {/* Investors Tab */}
          <TabsContent value="investors">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* List */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-slate-900">Pending Investors ({investors.length})</h2>
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
                <h2 className="text-xl font-semibold text-slate-900">Pending Companies ({companies.length})</h2>
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
        </Tabs>
      </div>
    </div>
  )
}
