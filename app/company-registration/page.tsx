"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Upload,
  Building2,
  FileText,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  TrendingUp,
  DollarSign,
  AlertCircle,
  Save,
  X,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"

export default function CompanyRegistration() {
  const [step, setStep] = useState(1)
  const { toast } = useToast()
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File>>({})

  const [formData, setFormData] = useState({
    // Company Information
    companyName: "",
    logo: null as File | null,
    yearOfIncorporation: "",
    registeredAddress: "",
    website: "",
    industry: "",
    aboutCompany: "",
    // Business Performance
    previousSales: "",
    previousTurnovers: "",
    keyClients: "",
    purchaseOrders: "",
    futureProjections: "",
    // Fundraising Details
    sharesOffered: "",
    pricePerShare: "",
    totalAmount: "",
    purposeOfFundraising: "",
    listingType: "normal" as "normal" | "premium",
    // Shareholding & Compliance
    shareholdingPattern: "",
    directorsPromoters: "",
    legalCompliance: false,
    // Contact
    contactPerson: "",
    email: "",
    mobile: "",
    declaration: false,
  })

  useEffect(() => {
    const savedData = localStorage.getItem("unlistx-company-registration")
    const savedStep = localStorage.getItem("unlistx-company-registration-step")
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        setFormData(parsed)
        if (savedStep) setStep(Number.parseInt(savedStep))
        toast({
          title: "Progress restored",
          description: "Your previous progress has been restored.",
        })
      } catch (e) {
        console.error("Failed to restore progress", e)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("unlistx-company-registration", JSON.stringify(formData))
    localStorage.setItem("unlistx-company-registration-step", step.toString())
  }, [formData, step])

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (formData.companyName || formData.email) {
        e.preventDefault()
        e.returnValue = ""
      }
    }
    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [formData])

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) return "Email is required"
    if (!emailRegex.test(email)) return "Please enter a valid email address"
    return ""
  }

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[\d\s+()-]{10,}$/
    if (!phone) return "Phone number is required"
    if (!phoneRegex.test(phone)) return "Please enter a valid phone number"
    return ""
  }

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {}

    if (currentStep === 1) {
      if (!formData.companyName) newErrors.companyName = "Company name is required"
      if (!formData.yearOfIncorporation) newErrors.yearOfIncorporation = "Year is required"
      if (!formData.industry) newErrors.industry = "Industry is required"
      if (!formData.registeredAddress) newErrors.registeredAddress = "Address is required"
      if (!formData.aboutCompany) newErrors.aboutCompany = "Company description is required"
      if (!formData.logo) newErrors.logo = "Company logo is required"
    } else if (currentStep === 3) {
      if (!formData.sharesOffered) newErrors.sharesOffered = "Number of shares is required"
      if (!formData.pricePerShare) newErrors.pricePerShare = "Price per share is required"
      if (!formData.totalAmount) newErrors.totalAmount = "Total amount is required"
      if (!formData.purposeOfFundraising) newErrors.purposeOfFundraising = "Purpose is required"
      // Validate listing type
      if (!formData.listingType) newErrors.listingType = "Listing type is required"
    } else if (currentStep === 4) {
      if (!formData.shareholdingPattern) newErrors.shareholdingPattern = "Shareholding pattern is required"
      if (!formData.directorsPromoters) newErrors.directorsPromoters = "Directors information is required"
      if (!formData.legalCompliance) newErrors.legalCompliance = "Legal compliance confirmation is required"
    } else if (currentStep === 6) {
      if (!formData.contactPerson) newErrors.contactPerson = "Contact person is required"
      if (!formData.email) newErrors.email = "Email is required"
      else if (validateEmail(formData.email)) newErrors.email = validateEmail(formData.email)
      if (!formData.mobile) newErrors.mobile = "Mobile number is required"
      else if (validatePhone(formData.mobile)) newErrors.mobile = validatePhone(formData.mobile)
      if (!formData.declaration) newErrors.declaration = "Declaration is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData({ ...formData, [name]: checked })
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const file = files[0]
      const fieldName = e.target.id

      if (fieldName === "logo") {
        setFormData({ ...formData, logo: file })
      } else {
        setUploadedFiles({ ...uploadedFiles, [fieldName]: file })
      }

      toast({
        title: "File uploaded",
        description: `${file.name} has been uploaded successfully.`,
      })

      if (errors[fieldName]) {
        setErrors({ ...errors, [fieldName]: "" })
      }
    }
  }

  const handleRemoveFile = (fieldName: string) => {
    if (fieldName === "logo") {
      setFormData({ ...formData, logo: null })
    } else {
      const newFiles = { ...uploadedFiles }
      delete newFiles[fieldName]
      setUploadedFiles(newFiles)
    }
    toast({
      title: "File removed",
      description: "The file has been removed.",
    })
  }

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields before proceeding.",
        variant: "destructive",
      })
    }
  }

  const handleSaveDraft = () => {
    localStorage.setItem("unlistx-company-registration", JSON.stringify(formData))
    localStorage.setItem("unlistx-company-registration-step", step.toString())
    toast({
      title: "Progress saved",
      description: "Your progress has been saved successfully.",
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep(6)) {
      toast({
        title: "Validation Error",
        description: "Please complete all required fields.",
        variant: "destructive",
      })
      return
    }
    setShowSubmitDialog(true)
  }

  const confirmSubmit = () => {
    console.log("Company registration:", formData)
    localStorage.removeItem("unlistx-company-registration")
    localStorage.removeItem("unlistx-company-registration-step")
    toast({
      title: "Registration submitted",
      description: "Your application has been submitted for admin approval.",
    })
    setShowSubmitDialog(false)
  }

  const getOverallProgress = () => {
    return Math.round((step / 6) * 100)
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              UnlistX
            </Link>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSaveDraft}
              className="gap-2 bg-transparent"
            >
              <Save className="h-4 w-4" />
              Save Progress
            </Button>
          </div>
        </header>

        <div className="container mx-auto px-4 py-12 max-w-5xl">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-muted-foreground">Registration Progress</h2>
              <span className="text-sm font-bold text-blue-600">{getOverallProgress()}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
              <div
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${getOverallProgress()}%` }}
              />
            </div>

            <div className="flex items-center justify-between mb-4">
              {[1, 2, 3, 4, 5, 6].map((s) => (
                <div key={s} className="flex items-center flex-1">
                  <button
                    type="button"
                    onClick={() => setStep(s)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                      step >= s
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-110"
                        : "bg-gray-200 text-gray-500 hover:bg-gray-300"
                    }`}
                  >
                    {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
                  </button>
                  {s < 6 && (
                    <div
                      className={`flex-1 h-1 mx-2 transition-colors ${
                        step > s ? "bg-gradient-to-r from-blue-600 to-purple-600" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs font-medium">
              <span className={step >= 1 ? "text-blue-600" : "text-gray-500"}>Company</span>
              <span className={step >= 2 ? "text-blue-600" : "text-gray-500"}>Performance</span>
              <span className={step >= 3 ? "text-blue-600" : "text-gray-500"}>Fundraising</span>
              <span className={step >= 4 ? "text-blue-600" : "text-gray-500"}>Compliance</span>
              <span className={step >= 5 ? "text-blue-600" : "text-gray-500"}>Documents</span>
              <span className={step >= 6 ? "text-blue-600" : "text-gray-500"}>Submit</span>
            </div>
          </div>

          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Start-up Registration Form</CardTitle>
              <CardDescription>Register your unlisted or Pre-IPO start-up to raise funds on UnlistX</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                {step === 1 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Building2 className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-semibold">Company Information</h3>
                    </div>

                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="companyName">Company Name *</Label>
                        <Input
                          id="companyName"
                          name="companyName"
                          placeholder="Your Company Pvt Ltd"
                          value={formData.companyName}
                          onChange={handleInputChange}
                          className={`border-2 focus:border-blue-600 transition-colors ${errors.companyName ? "border-red-500" : ""}`}
                          required
                        />
                        {errors.companyName && (
                          <p className="text-sm text-red-500 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.companyName}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="logo">Company Logo *</Label>
                        <div className="flex items-start gap-4">
                          <div className="flex-1">
                            <Input
                              id="logo"
                              type="file"
                              accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                              onChange={handleFileUpload}
                              className={`border-2 focus:border-blue-600 transition-colors ${errors.logo ? "border-red-500" : ""}`}
                              required={!formData.logo}
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              Upload a square logo (recommended: 400x400px). Will be displayed in circular format.
                            </p>
                            {errors.logo && (
                              <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                                <AlertCircle className="h-3 w-3" />
                                {errors.logo}
                              </p>
                            )}
                          </div>
                          {formData.logo && (
                            <div className="relative">
                              <div className="w-20 h-20 rounded-full border-2 border-blue-600 overflow-hidden bg-white flex items-center justify-center">
                                <img
                                  src={URL.createObjectURL(formData.logo) || "/placeholder.svg"}
                                  alt="Logo preview"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveFile("logo")}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="yearOfIncorporation">Year of Incorporation *</Label>
                          <Input
                            id="yearOfIncorporation"
                            name="yearOfIncorporation"
                            type="number"
                            placeholder="2020"
                            value={formData.yearOfIncorporation}
                            onChange={handleInputChange}
                            className={`border-2 focus:border-blue-600 transition-colors ${errors.yearOfIncorporation ? "border-red-500" : ""}`}
                            required
                          />
                          {errors.yearOfIncorporation && (
                            <p className="text-sm text-red-500 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors.yearOfIncorporation}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="industry">Industry / Sector *</Label>
                          <Select
                            onValueChange={(value) => handleSelectChange("industry", value)}
                            defaultValue={formData.industry}
                            required
                          >
                            <SelectTrigger
                              className={`border-2 focus:border-blue-600 transition-colors ${errors.industry ? "border-red-500" : ""}`}
                            >
                              <SelectValue placeholder="Select industry" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="tech">Technology</SelectItem>
                              <SelectItem value="healthcare">Healthcare</SelectItem>
                              <SelectItem value="fintech">Fintech</SelectItem>
                              <SelectItem value="consumer">Consumer</SelectItem>
                              <SelectItem value="energy">Energy</SelectItem>
                              <SelectItem value="manufacturing">Manufacturing</SelectItem>
                              <SelectItem value="ecommerce">E-commerce</SelectItem>
                              <SelectItem value="education">Education</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.industry && (
                            <p className="text-sm text-red-500 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors.industry}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="registeredAddress">Registered Address *</Label>
                        <Input
                          id="registeredAddress"
                          name="registeredAddress"
                          placeholder="Complete registered address"
                          value={formData.registeredAddress}
                          onChange={handleInputChange}
                          className={`border-2 focus:border-blue-600 transition-colors ${errors.registeredAddress ? "border-red-500" : ""}`}
                          required
                        />
                        {errors.registeredAddress && (
                          <p className="text-sm text-red-500 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.registeredAddress}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="website">Website / Company Profile Link</Label>
                        <Input
                          id="website"
                          name="website"
                          type="url"
                          placeholder="https://yourcompany.com"
                          value={formData.website}
                          onChange={handleInputChange}
                          className="border-2 focus:border-blue-600 transition-colors"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="aboutCompany">About the Company *</Label>
                        <Textarea
                          id="aboutCompany"
                          name="aboutCompany"
                          placeholder="Brief description of your company, products/services, and market position..."
                          value={formData.aboutCompany}
                          onChange={handleInputChange}
                          rows={4}
                          className={`border-2 focus:border-blue-600 transition-colors ${errors.aboutCompany ? "border-red-500" : ""}`}
                          required
                        />
                        {errors.aboutCompany && (
                          <p className="text-sm text-red-500 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.aboutCompany}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button type="button" onClick={handleNextStep} className="gap-2">
                        Next Step <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-semibold">Business Performance</h3>
                    </div>

                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="previousSales">Previous Annual Sales (Year-wise)</Label>
                        <Textarea
                          id="previousSales"
                          name="previousSales"
                          placeholder="e.g., FY 2022: ₹50L, FY 2023: ₹1.2Cr, FY 2024: ₹2.5Cr"
                          value={formData.previousSales}
                          onChange={handleInputChange}
                          rows={3}
                          className="border-2 focus:border-blue-600 transition-colors"
                        />
                        <p className="text-xs text-muted-foreground">Optional - or upload as document in later step</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="previousTurnovers">Previous Turnovers (Last 3 Years)</Label>
                        <Textarea
                          id="previousTurnovers"
                          name="previousTurnovers"
                          placeholder="Provide turnover details for the last 3 financial years..."
                          value={formData.previousTurnovers}
                          onChange={handleInputChange}
                          rows={3}
                          className="border-2 focus:border-blue-600 transition-colors"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="keyClients">Key Clients / Customers</Label>
                        <Textarea
                          id="keyClients"
                          name="keyClients"
                          placeholder="List your major clients or customer segments..."
                          value={formData.keyClients}
                          onChange={handleInputChange}
                          rows={3}
                          className="border-2 focus:border-blue-600 transition-colors"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="purchaseOrders">Present Purchase Orders</Label>
                        <Textarea
                          id="purchaseOrders"
                          name="purchaseOrders"
                          placeholder="Details of current purchase orders (value in ₹ / $)..."
                          value={formData.purchaseOrders}
                          onChange={handleInputChange}
                          rows={3}
                          className="border-2 focus:border-blue-600 transition-colors"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="futureProjections">Future Business Projections (1-3 Years)</Label>
                        <Textarea
                          id="futureProjections"
                          name="futureProjections"
                          placeholder="Provide your business forecast for the next 1-3 years..."
                          value={formData.futureProjections}
                          onChange={handleInputChange}
                          rows={4}
                          className="border-2 focus:border-blue-600 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Button type="button" variant="outline" onClick={() => setStep(1)} className="gap-2">
                        <ArrowLeft className="w-4 h-4" /> Previous
                      </Button>
                      <Button type="button" onClick={handleNextStep} className="gap-2">
                        Next Step <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <DollarSign className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-semibold">Fundraising Details</h3>
                    </div>

                    <div className="grid gap-4">
                      <div className="space-y-3">
                        <Label>Listing Type *</Label>
                        <div className="grid md:grid-cols-2 gap-4">
                          <Card
                            className={`p-4 cursor-pointer transition-all border-2 ${
                              formData.listingType === "normal"
                                ? "border-blue-600 bg-blue-50 ring-2 ring-blue-600"
                                : "border-slate-200 hover:border-blue-300"
                            }`}
                            onClick={() => handleSelectChange("listingType", "normal")}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-semibold text-slate-900">Normal Listing</h4>
                                <p className="text-2xl font-bold text-blue-600 mt-1">₹5,000</p>
                              </div>
                              <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                  formData.listingType === "normal" ? "border-blue-600 bg-blue-600" : "border-slate-300"
                                }`}
                              >
                                {formData.listingType === "normal" && <CheckCircle2 className="w-4 h-4 text-white" />}
                              </div>
                            </div>
                            <ul className="space-y-1 text-sm text-slate-600">
                              <li className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                                Standard visibility in database
                              </li>
                              <li className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                                Searchable by investors
                              </li>
                              <li className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                                Company profile page
                              </li>
                            </ul>
                          </Card>

                          <Card
                            className={`p-4 cursor-pointer transition-all border-2 relative overflow-hidden ${
                              formData.listingType === "premium"
                                ? "border-purple-600 bg-purple-50 ring-2 ring-purple-600"
                                : "border-slate-200 hover:border-purple-300"
                            }`}
                            onClick={() => handleSelectChange("listingType", "premium")}
                          >
                            <div className="absolute top-2 right-2">
                              <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 text-xs">
                                FEATURED
                              </Badge>
                            </div>
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-semibold text-slate-900">Premium Listing</h4>
                                <p className="text-2xl font-bold text-purple-600 mt-1">₹50,000</p>
                              </div>
                              <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                  formData.listingType === "premium"
                                    ? "border-purple-600 bg-purple-600"
                                    : "border-slate-300"
                                }`}
                              >
                                {formData.listingType === "premium" && <CheckCircle2 className="w-4 h-4 text-white" />}
                              </div>
                            </div>
                            <ul className="space-y-1 text-sm text-slate-600">
                              <li className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-purple-600" />
                                Featured on home page
                              </li>
                              <li className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-purple-600" />
                                Priority in search results
                              </li>
                              <li className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-purple-600" />
                                Enhanced company profile
                              </li>
                              <li className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-purple-600" />
                                Email to all investors
                              </li>
                            </ul>
                          </Card>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="sharesOffered">Number of Shares Offered for Sale *</Label>
                          <Input
                            id="sharesOffered"
                            name="sharesOffered"
                            type="number"
                            placeholder="10000"
                            value={formData.sharesOffered}
                            onChange={handleInputChange}
                            className={`border-2 focus:border-blue-600 transition-colors ${errors.sharesOffered ? "border-red-500" : ""}`}
                            required
                          />
                          {errors.sharesOffered && (
                            <p className="text-sm text-red-500 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors.sharesOffered}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="pricePerShare">Price per Share (₹ / $) *</Label>
                          <Input
                            id="pricePerShare"
                            name="pricePerShare"
                            type="number"
                            placeholder="500"
                            value={formData.pricePerShare}
                            onChange={handleInputChange}
                            className={`border-2 focus:border-blue-600 transition-colors ${errors.pricePerShare ? "border-red-500" : ""}`}
                            required
                          />
                          {errors.pricePerShare && (
                            <p className="text-sm text-red-500 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors.pricePerShare}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="totalAmount">Total Fundraising Amount Target *</Label>
                        <Input
                          id="totalAmount"
                          name="totalAmount"
                          placeholder="₹50,00,000 or $100,000"
                          value={formData.totalAmount}
                          onChange={handleInputChange}
                          className={`border-2 focus:border-blue-600 transition-colors ${errors.totalAmount ? "border-red-500" : ""}`}
                          required
                        />
                        {errors.totalAmount && (
                          <p className="text-sm text-red-500 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.totalAmount}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="purposeOfFundraising">Purpose of Fundraising *</Label>
                        <Textarea
                          id="purposeOfFundraising"
                          name="purposeOfFundraising"
                          placeholder="e.g., Business expansion, R&D, working capital, marketing, hiring, etc."
                          value={formData.purposeOfFundraising}
                          onChange={handleInputChange}
                          rows={4}
                          className={`border-2 focus:border-blue-600 transition-colors ${errors.purposeOfFundraising ? "border-red-500" : ""}`}
                          required
                        />
                        {errors.purposeOfFundraising && (
                          <p className="text-sm text-red-500 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.purposeOfFundraising}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Button type="button" variant="outline" onClick={() => setStep(2)} className="gap-2">
                        <ArrowLeft className="w-4 h-4" /> Previous
                      </Button>
                      <Button type="button" onClick={handleNextStep} className="gap-2">
                        Next Step <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-semibold">Shareholding & Compliance</h3>
                    </div>

                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="shareholdingPattern">Current Shareholding Pattern *</Label>
                        <Textarea
                          id="shareholdingPattern"
                          name="shareholdingPattern"
                          placeholder="Describe current shareholding structure or upload cap table in next step..."
                          value={formData.shareholdingPattern}
                          onChange={handleInputChange}
                          rows={4}
                          className={`border-2 focus:border-blue-600 transition-colors ${errors.shareholdingPattern ? "border-red-500" : ""}`}
                          required
                        />
                        <p className="text-xs text-muted-foreground">
                          You can also upload your cap table in the documents section
                        </p>
                        {errors.shareholdingPattern && (
                          <p className="text-sm text-red-500 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.shareholdingPattern}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="directorsPromoters">Directors / Promoters *</Label>
                        <Textarea
                          id="directorsPromoters"
                          name="directorsPromoters"
                          placeholder="Names and brief profiles of directors and promoters..."
                          value={formData.directorsPromoters}
                          onChange={handleInputChange}
                          rows={4}
                          className={`border-2 focus:border-blue-600 transition-colors ${errors.directorsPromoters ? "border-red-500" : ""}`}
                          required
                        />
                        {errors.directorsPromoters && (
                          <p className="text-sm text-red-500 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.directorsPromoters}
                          </p>
                        )}
                      </div>

                      <div className="flex items-start space-x-3 space-y-0 rounded-md border-2 p-4 hover:border-blue-600/50 hover:bg-blue-50/50 transition-all">
                        <Checkbox
                          id="legalCompliance"
                          checked={formData.legalCompliance}
                          onCheckedChange={(checked) => handleCheckboxChange("legalCompliance", checked as boolean)}
                          className={`border-2 mt-0.5 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 ${errors.legalCompliance ? "border-red-500" : ""}`}
                        />
                        <div className="space-y-1 leading-none">
                          <Label htmlFor="legalCompliance" className="cursor-pointer">
                            Legal Compliance Confirmation *
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            I confirm that ROC filings are updated and there are no pending litigations against the
                            company
                          </p>
                        </div>
                      </div>
                      {errors.legalCompliance && (
                        <p className="text-sm text-red-500 flex items-center gap-1 -mt-3">
                          <AlertCircle className="h-3 w-3" />
                          {errors.legalCompliance}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-between">
                      <Button type="button" variant="outline" onClick={() => setStep(3)} className="gap-2">
                        <ArrowLeft className="w-4 h-4" /> Previous
                      </Button>
                      <Button type="button" onClick={handleNextStep} className="gap-2">
                        Next Step <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {step === 5 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Upload className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-semibold">Supporting Documents</h3>
                    </div>

                    <div className="grid gap-4">
                      {[
                        { id: "financials", label: "Last 2-3 Years Audited Financials *", required: true },
                        { id: "businessPlan", label: "Business Plan / Pitch Deck *", required: true },
                        { id: "valuationReport", label: "Valuation Report (if available)", required: false },
                        { id: "purchaseOrdersDocs", label: "Purchase Orders / MOUs (if available)", required: false },
                      ].map((doc) => (
                        <div key={doc.id} className="space-y-2">
                          <Label htmlFor={doc.id}>{doc.label}</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              id={doc.id}
                              type="file"
                              accept=".pdf,.ppt,.pptx"
                              onChange={handleFileUpload}
                              className="border-2 focus:border-blue-600 transition-colors"
                              required={doc.required && !uploadedFiles[doc.id]}
                            />
                            {uploadedFiles[doc.id] ? (
                              <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveFile(doc.id)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <Upload className="w-5 h-5 text-muted-foreground" />
                            )}
                          </div>
                          {uploadedFiles[doc.id] && (
                            <p className="text-xs text-green-600 flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              {uploadedFiles[doc.id].name}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between">
                      <Button type="button" variant="outline" onClick={() => setStep(4)} className="gap-2">
                        <ArrowLeft className="w-4 h-4" /> Previous
                      </Button>
                      <Button type="button" onClick={handleNextStep} className="gap-2">
                        Next Step <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {step === 6 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle2 className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-semibold">Declaration & Submission</h3>
                    </div>

                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="contactPerson">Contact Person Name *</Label>
                        <Input
                          id="contactPerson"
                          name="contactPerson"
                          placeholder="Full name"
                          value={formData.contactPerson}
                          onChange={handleInputChange}
                          className={`border-2 focus:border-blue-600 transition-colors ${errors.contactPerson ? "border-red-500" : ""}`}
                          required
                        />
                        {errors.contactPerson && (
                          <p className="text-sm text-red-500 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.contactPerson}
                          </p>
                        )}
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="contact@company.com"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`border-2 focus:border-blue-600 transition-colors ${errors.email ? "border-red-500" : ""}`}
                            required
                          />
                          {errors.email && (
                            <p className="text-sm text-red-500 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors.email}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="mobile">Mobile Number *</Label>
                          <Input
                            id="mobile"
                            name="mobile"
                            type="tel"
                            placeholder="+91 98765 43210"
                            value={formData.mobile}
                            onChange={handleInputChange}
                            className={`border-2 focus:border-blue-600 transition-colors ${errors.mobile ? "border-red-500" : ""}`}
                            required
                          />
                          {errors.mobile && (
                            <p className="text-sm text-red-500 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors.mobile}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 space-y-0 rounded-md border-2 p-4 bg-blue-50 border-blue-200 hover:border-blue-400 transition-all">
                      <Checkbox
                        id="declaration"
                        checked={formData.declaration}
                        onCheckedChange={(checked) => handleCheckboxChange("declaration", checked as boolean)}
                        className={`border-2 mt-0.5 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 ${errors.declaration ? "border-red-500" : ""}`}
                        required
                      />
                      <div className="space-y-1 leading-none">
                        <Label htmlFor="declaration" className="cursor-pointer font-semibold">
                          Declaration *
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          I hereby declare that the information provided is true and correct to the best of my knowledge
                        </p>
                      </div>
                    </div>
                    {errors.declaration && (
                      <p className="text-sm text-red-500 flex items-center gap-1 -mt-3">
                        <AlertCircle className="h-3 w-3" />
                        {errors.declaration}
                      </p>
                    )}

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <h4 className="font-semibold mb-2 text-amber-900">What Happens Next?</h4>
                      <ul className="space-y-2 text-sm text-amber-800">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>Admin team will review your application within 2-3 business days</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>You'll receive email updates on your application status</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>Upon approval, you can list your offering on the UnlistX Showcase</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>Track investor interest and manage your fundraising campaign</span>
                        </li>
                      </ul>
                    </div>

                    <div className="flex justify-between">
                      <Button type="button" variant="outline" onClick={() => setStep(5)} className="gap-2">
                        <ArrowLeft className="w-4 h-4" /> Previous
                      </Button>
                      <Button
                        type="submit"
                        className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        disabled={!formData.declaration}
                      >
                        Submit Application <CheckCircle2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Submission</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to submit your company registration? Please review all information before
              submitting. Once submitted, your application will be reviewed by our admin team.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Review Again</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSubmit} className="bg-gradient-to-r from-blue-600 to-purple-600">
              Confirm & Submit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
