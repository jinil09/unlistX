"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Building2,
  User,
  ArrowLeft,
  Mail,
  Lock,
  Phone,
  Briefcase,
  CreditCard,
  TrendingUp,
  Target,
  CheckCircle2,
  AlertCircle,
  Info,
  Eye,
  EyeOff,
  Save,
} from "lucide-react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { useToast } from "@/hooks/use-toast"
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

const checkPasswordStrength = (password: string) => {
  let strength = 0
  if (password.length >= 8) strength++
  if (password.length >= 12) strength++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
  if (/\d/.test(password)) strength++
  if (/[^a-zA-Z0-9]/.test(password)) strength++

  if (strength <= 2) return { level: "weak", color: "text-red-500", bg: "bg-red-500" }
  if (strength <= 3) return { level: "medium", color: "text-yellow-500", bg: "bg-yellow-500" }
  return { level: "strong", color: "text-green-500", bg: "bg-green-500" }
}

export default function SignUpPage() {
  const [activeTab, setActiveTab] = useState("investor")
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showExitDialog, setShowExitDialog] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const [investorForm, setInvestorForm] = useState({
    // Personal Information
    fullName: "",
    email: "",
    phone: "",
    country: "",
    panId: "",
    password: "",
    confirmPassword: "",

    // Professional/Investment Profile
    occupation: "",
    organization: "",
    annualIncome: "",
    investmentCapacity: "",

    // Investment Experience
    previousInvestments: [] as string[],
    yearsOfExperience: "",

    // Areas of Interest
    preferredSectors: [] as string[],
    investmentStage: [] as string[],

    // Compliance
    accreditationStatus: false,
    termsAccepted: false,
    privacyAccepted: false,

    // Optional
    bio: "",
  })

  const [companyForm, setCompanyForm] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })

  useEffect(() => {
    const savedData = localStorage.getItem(`unlistx-${activeTab}-form`)
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        if (activeTab === "investor") {
          setInvestorForm(parsed)
        } else {
          setCompanyForm(parsed)
        }
        toast({
          title: "Draft restored",
          description: "Your previous progress has been restored.",
        })
      } catch (e) {
        console.error("Failed to restore draft", e)
      }
    }
  }, [activeTab])

  useEffect(() => {
    if (hasUnsavedChanges) {
      const data = activeTab === "investor" ? investorForm : companyForm
      localStorage.setItem(`unlistx-${activeTab}-form`, JSON.stringify(data))
    }
  }, [investorForm, companyForm, activeTab, hasUnsavedChanges])

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ""
      }
    }
    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [hasUnsavedChanges])

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

  const validatePasswordMatch = (password: string, confirmPassword: string) => {
    if (confirmPassword && password !== confirmPassword) {
      return "Passwords do not match"
    }
    return ""
  }

  const handleInvestorChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setInvestorForm({ ...investorForm, [name]: value })
    setHasUnsavedChanges(true)

    if (name === "email") {
      const error = validateEmail(value)
      setErrors({ ...errors, email: error })
    } else if (name === "phone") {
      const error = validatePhone(value)
      setErrors({ ...errors, phone: error })
    } else if (name === "confirmPassword") {
      const error = validatePasswordMatch(investorForm.password, value)
      setErrors({ ...errors, confirmPassword: error })
    } else if (name === "password") {
      const error = validatePasswordMatch(value, investorForm.confirmPassword)
      setErrors({ ...errors, confirmPassword: error })
    }
  }

  const handleInvestorSelectChange = (name: string, value: string) => {
    setInvestorForm({ ...investorForm, [name]: value })
    setHasUnsavedChanges(true)
  }

  const handleInvestorCheckboxChange = (name: string, checked: boolean) => {
    setInvestorForm({ ...investorForm, [name]: checked })
    setHasUnsavedChanges(true)
  }

  const handleInvestorMultiSelect = (name: string, value: string) => {
    const currentValues = investorForm[name as keyof typeof investorForm] as string[]
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value]
    setInvestorForm({ ...investorForm, [name]: newValues })
    setHasUnsavedChanges(true)
  }

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCompanyForm({ ...companyForm, [name]: value })
    setHasUnsavedChanges(true)

    if (name === "email") {
      const error = validateEmail(value)
      setErrors({ ...errors, companyEmail: error })
    } else if (name === "phone") {
      const error = validatePhone(value)
      setErrors({ ...errors, companyPhone: error })
    } else if (name === "confirmPassword") {
      const error = validatePasswordMatch(companyForm.password, value)
      setErrors({ ...errors, companyConfirmPassword: error })
    } else if (name === "password") {
      const error = validatePasswordMatch(value, companyForm.confirmPassword)
      setErrors({ ...errors, companyConfirmPassword: error })
    }
  }

  const handleSaveDraft = () => {
    const data = activeTab === "investor" ? investorForm : companyForm
    localStorage.setItem(`unlistx-${activeTab}-form`, JSON.stringify(data))
    toast({
      title: "Draft saved",
      description: "Your progress has been saved successfully.",
    })
  }

  const handleInvestorSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Record<string, string> = {}
    if (!investorForm.fullName) newErrors.fullName = "Full name is required"
    if (!investorForm.email) newErrors.email = "Email is required"
    else if (validateEmail(investorForm.email)) newErrors.email = validateEmail(investorForm.email)
    if (!investorForm.phone) newErrors.phone = "Phone is required"
    else if (validatePhone(investorForm.phone)) newErrors.phone = validatePhone(investorForm.phone)
    if (!investorForm.password) newErrors.password = "Password is required"
    if (validatePasswordMatch(investorForm.password, investorForm.confirmPassword)) {
      newErrors.confirmPassword = validatePasswordMatch(investorForm.password, investorForm.confirmPassword)
    }
    if (!investorForm.termsAccepted) newErrors.terms = "You must accept the terms and conditions"
    if (!investorForm.privacyAccepted) newErrors.privacy = "You must accept the privacy policy"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      toast({
        title: "Validation Error",
        description: "Please fix the errors before submitting.",
        variant: "destructive",
      })
      return
    }

    console.log("Investor signup:", investorForm)
    localStorage.removeItem("unlistx-investor-form")
    setHasUnsavedChanges(false)
    toast({
      title: "Registration Successful!",
      description: "Your investor account has been created. Check your email for verification.",
    })
  }

  const handleCompanySubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Record<string, string> = {}
    if (!companyForm.companyName) newErrors.companyName = "Company name is required"
    if (!companyForm.email) newErrors.companyEmail = "Email is required"
    else if (validateEmail(companyForm.email)) newErrors.companyEmail = validateEmail(companyForm.email)
    if (validatePasswordMatch(companyForm.password, companyForm.confirmPassword)) {
      newErrors.companyConfirmPassword = validatePasswordMatch(companyForm.password, companyForm.confirmPassword)
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      toast({
        title: "Validation Error",
        description: "Please fix the errors before submitting.",
        variant: "destructive",
      })
      return
    }

    console.log("Company signup:", companyForm)
    localStorage.removeItem("unlistx-company-form")
    setHasUnsavedChanges(false)
    toast({
      title: "Registration Successful!",
      description: "Your company account has been created.",
    })
  }

  const getInvestorProgress = () => {
    const requiredFields = [
      investorForm.fullName,
      investorForm.email,
      investorForm.phone,
      investorForm.country,
      investorForm.password,
      investorForm.confirmPassword,
      investorForm.annualIncome,
      investorForm.investmentCapacity,
      investorForm.yearsOfExperience,
      investorForm.termsAccepted,
      investorForm.privacyAccepted,
    ]
    const filled = requiredFields.filter(Boolean).length
    return Math.round((filled / requiredFields.length) * 100)
  }

  const passwordStrength =
    activeTab === "investor"
      ? checkPasswordStrength(investorForm.password)
      : checkPasswordStrength(companyForm.password)

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-3xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <Card className="border-2 shadow-xl">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Create Your Account
              </CardTitle>
              <CardDescription className="text-base">
                Join UnlistX and start investing in unlisted and Pre-IPO start-ups
              </CardDescription>
              {activeTab === "investor" && (
                <div className="pt-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Profile Completion</span>
                    <span className="font-semibold text-primary">{getInvestorProgress()}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-500"
                      style={{ width: `${getInvestorProgress()}%` }}
                    />
                  </div>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="flex justify-end mb-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSaveDraft}
                  className="gap-2 bg-transparent"
                >
                  <Save className="h-4 w-4" />
                  Save Draft
                </Button>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="investor" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Investor
                  </TabsTrigger>
                  <TabsTrigger value="company" className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Company
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="investor">
                  <form onSubmit={handleInvestorSubmit} className="space-y-8">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <User className="h-5 w-5 text-primary" />
                        Personal Information
                      </h3>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="investor-fullName">Full Name *</Label>
                          <Input
                            id="investor-fullName"
                            name="fullName"
                            placeholder="Enter your full name"
                            value={investorForm.fullName}
                            onChange={handleInvestorChange}
                            className={`border-2 focus:border-primary transition-colors ${errors.fullName ? "border-red-500" : ""}`}
                            required
                          />
                          {errors.fullName && (
                            <p className="text-sm text-red-500 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors.fullName}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="investor-email">Email Address *</Label>
                          <Input
                            id="investor-email"
                            name="email"
                            type="email"
                            placeholder="your.email@example.com"
                            value={investorForm.email}
                            onChange={handleInvestorChange}
                            className={`border-2 focus:border-primary transition-colors ${errors.email ? "border-red-500" : ""}`}
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
                          <Label htmlFor="investor-phone">Mobile Number *</Label>
                          <Input
                            id="investor-phone"
                            name="phone"
                            type="tel"
                            placeholder="+91 XXXXX XXXXX"
                            value={investorForm.phone}
                            onChange={handleInvestorChange}
                            className={`border-2 focus:border-primary transition-colors ${errors.phone ? "border-red-500" : ""}`}
                            required
                          />
                          {errors.phone && (
                            <p className="text-sm text-red-500 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors.phone}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="investor-country">Country of Residence *</Label>
                          <Select
                            value={investorForm.country}
                            onValueChange={(value) => handleInvestorSelectChange("country", value)}
                          >
                            <SelectTrigger
                              id="investor-country"
                              className="border-2 focus:border-primary transition-colors"
                            >
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="india">India</SelectItem>
                              <SelectItem value="usa">United States</SelectItem>
                              <SelectItem value="uk">United Kingdom</SelectItem>
                              <SelectItem value="singapore">Singapore</SelectItem>
                              <SelectItem value="uae">UAE</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="investor-panId">
                            PAN / ID Number
                            <span
                              className="ml-1 text-muted-foreground cursor-help"
                              title="Your PAN card or government ID number for verification"
                            >
                              <Info className="h-3 w-3 inline" />
                            </span>
                          </Label>
                          <Input
                            id="investor-panId"
                            name="panId"
                            placeholder="Enter PAN or ID number"
                            value={investorForm.panId}
                            onChange={handleInvestorChange}
                            className="border-2 focus:border-primary transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-primary" />
                        Professional & Investment Profile
                      </h3>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="investor-occupation">Occupation / Designation</Label>
                          <Input
                            id="investor-occupation"
                            name="occupation"
                            placeholder="e.g., Software Engineer"
                            value={investorForm.occupation}
                            onChange={handleInvestorChange}
                            className="border-2 focus:border-primary transition-colors"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="investor-organization">Organization / Company Name</Label>
                          <Input
                            id="investor-organization"
                            name="organization"
                            placeholder="Company name (optional)"
                            value={investorForm.organization}
                            onChange={handleInvestorChange}
                            className="border-2 focus:border-primary transition-colors"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="investor-annualIncome">Annual Income Bracket *</Label>
                          <Select
                            value={investorForm.annualIncome}
                            onValueChange={(value) => handleInvestorSelectChange("annualIncome", value)}
                          >
                            <SelectTrigger
                              id="investor-annualIncome"
                              className="border-2 focus:border-primary transition-colors"
                            >
                              <SelectValue placeholder="Select income range" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="below-10l">Below ₹10 Lakhs</SelectItem>
                              <SelectItem value="10l-25l">₹10L - ₹25L</SelectItem>
                              <SelectItem value="25l-50l">₹25L - ₹50L</SelectItem>
                              <SelectItem value="50l-1cr">₹50L - ₹1 Crore</SelectItem>
                              <SelectItem value="above-1cr">Above ₹1 Crore</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="investor-investmentCapacity">Investment Capacity *</Label>
                          <Select
                            value={investorForm.investmentCapacity}
                            onValueChange={(value) => handleInvestorSelectChange("investmentCapacity", value)}
                          >
                            <SelectTrigger
                              id="investor-investmentCapacity"
                              className="border-2 focus:border-primary transition-colors"
                            >
                              <SelectValue placeholder="Select capacity" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="below-10l">Below ₹10 Lakhs</SelectItem>
                              <SelectItem value="10l-50l">₹10L - ₹50L</SelectItem>
                              <SelectItem value="50l-1cr">₹50L - ₹1 Crore</SelectItem>
                              <SelectItem value="above-1cr">Above ₹1 Crore</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        Investment Experience
                      </h3>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Previous Investments (select all that apply)</Label>
                          <div className="grid md:grid-cols-2 gap-3">
                            {[
                              { value: "public-equities", label: "Public Equities" },
                              { value: "mutual-funds", label: "Mutual Funds" },
                              { value: "startups", label: "Startups / Angel Investing" },
                              { value: "private-equity", label: "Private Equity" },
                              { value: "real-estate", label: "Real Estate" },
                              { value: "pre-ipo", label: "Pre-IPO / Unlisted Shares" },
                            ].map((investment) => (
                              <div
                                key={investment.value}
                                className="flex items-center space-x-3 p-3 rounded-lg border-2 hover:border-primary/50 hover:bg-primary/5 transition-all"
                              >
                                <Checkbox
                                  id={investment.value}
                                  checked={investorForm.previousInvestments.includes(investment.value)}
                                  onCheckedChange={(checked) =>
                                    handleInvestorMultiSelect("previousInvestments", investment.value)
                                  }
                                  className="border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                />
                                <label
                                  htmlFor={investment.value}
                                  className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {investment.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="investor-yearsOfExperience">Years of Investment Experience *</Label>
                          <Select
                            value={investorForm.yearsOfExperience}
                            onValueChange={(value) => handleInvestorSelectChange("yearsOfExperience", value)}
                          >
                            <SelectTrigger
                              id="investor-yearsOfExperience"
                              className="border-2 focus:border-primary transition-colors"
                            >
                              <SelectValue placeholder="Select experience" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0-2">0-2 years</SelectItem>
                              <SelectItem value="3-5">3-5 years</SelectItem>
                              <SelectItem value="6-10">6-10 years</SelectItem>
                              <SelectItem value="10+">10+ years</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Target className="h-5 w-5 text-primary" />
                        Areas of Interest
                      </h3>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Preferred Sectors / Industries (select all that apply)</Label>
                          <div className="grid md:grid-cols-2 gap-3">
                            {[
                              { value: "tech", label: "Technology" },
                              { value: "healthcare", label: "Healthcare" },
                              { value: "fintech", label: "Fintech" },
                              { value: "consumer", label: "Consumer Goods" },
                              { value: "energy", label: "Energy" },
                              { value: "ecommerce", label: "E-commerce" },
                              { value: "saas", label: "SaaS" },
                              { value: "manufacturing", label: "Manufacturing" },
                            ].map((sector) => (
                              <div
                                key={sector.value}
                                className="flex items-center space-x-3 p-3 rounded-lg border-2 hover:border-primary/50 hover:bg-primary/5 transition-all"
                              >
                                <Checkbox
                                  id={sector.value}
                                  checked={investorForm.preferredSectors.includes(sector.value)}
                                  onCheckedChange={(checked) =>
                                    handleInvestorMultiSelect("preferredSectors", sector.value)
                                  }
                                  className="border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                />
                                <label
                                  htmlFor={sector.value}
                                  className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {sector.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Investment Stage Preference (select all that apply)</Label>
                          <div className="grid md:grid-cols-3 gap-3">
                            {[
                              { value: "early-stage", label: "Early Stage Startups" },
                              { value: "growth-stage", label: "Growth Stage" },
                              { value: "pre-ipo", label: "Pre-IPO / Unlisted" },
                            ].map((stage) => (
                              <div
                                key={stage.value}
                                className="flex items-center space-x-3 p-3 rounded-lg border-2 hover:border-primary/50 hover:bg-primary/5 transition-all"
                              >
                                <Checkbox
                                  id={stage.value}
                                  checked={investorForm.investmentStage.includes(stage.value)}
                                  onCheckedChange={(checked) =>
                                    handleInvestorMultiSelect("investmentStage", stage.value)
                                  }
                                  className="border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                />
                                <label
                                  htmlFor={stage.value}
                                  className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {stage.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Lock className="h-5 w-5 text-primary" />
                        Account Security
                      </h3>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="investor-password">Password *</Label>
                          <div className="relative">
                            <Input
                              id="investor-password"
                              name="password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Create a strong password"
                              value={investorForm.password}
                              onChange={handleInvestorChange}
                              className="border-2 focus:border-primary transition-colors pr-10"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                          {investorForm.password && (
                            <div className="space-y-1">
                              <div className="flex gap-1">
                                <div
                                  className={`h-1 flex-1 rounded ${passwordStrength.bg} ${passwordStrength.level === "weak" ? "opacity-100" : "opacity-30"}`}
                                />
                                <div
                                  className={`h-1 flex-1 rounded ${passwordStrength.bg} ${passwordStrength.level === "medium" || passwordStrength.level === "strong" ? "opacity-100" : "opacity-30"}`}
                                />
                                <div
                                  className={`h-1 flex-1 rounded ${passwordStrength.bg} ${passwordStrength.level === "strong" ? "opacity-100" : "opacity-30"}`}
                                />
                              </div>
                              <p className={`text-xs ${passwordStrength.color} capitalize`}>
                                {passwordStrength.level} password
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="investor-confirmPassword">Confirm Password *</Label>
                          <div className="relative">
                            <Input
                              id="investor-confirmPassword"
                              name="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Re-enter your password"
                              value={investorForm.confirmPassword}
                              onChange={handleInvestorChange}
                              className={`border-2 focus:border-primary transition-colors pr-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                          {errors.confirmPassword && (
                            <p className="text-sm text-red-500 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors.confirmPassword}
                            </p>
                          )}
                          {investorForm.confirmPassword &&
                            !errors.confirmPassword &&
                            investorForm.password === investorForm.confirmPassword && (
                              <p className="text-sm text-green-500 flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3" />
                                Passwords match
                              </p>
                            )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-primary" />
                        Compliance & Declarations
                      </h3>

                      <div className="space-y-3">
                        <div className="flex items-start space-x-3 p-4 rounded-lg border-2 hover:border-primary/50 hover:bg-primary/5 transition-all">
                          <Checkbox
                            id="accreditation"
                            checked={investorForm.accreditationStatus}
                            onCheckedChange={(checked) =>
                              handleInvestorCheckboxChange("accreditationStatus", checked as boolean)
                            }
                            className="border-2 mt-0.5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                          />
                          <label
                            htmlFor="accreditation"
                            className="text-sm font-medium leading-relaxed cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            I am an accredited investor (as per applicable regulations)
                          </label>
                        </div>

                        <div className="flex items-start space-x-3 p-4 rounded-lg border-2 hover:border-primary/50 hover:bg-primary/5 transition-all">
                          <Checkbox
                            id="terms"
                            checked={investorForm.termsAccepted}
                            onCheckedChange={(checked) =>
                              handleInvestorCheckboxChange("termsAccepted", checked as boolean)
                            }
                            className="border-2 mt-0.5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                            required
                          />
                          <label
                            htmlFor="terms"
                            className="text-sm font-medium leading-relaxed cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            I confirm that the information provided is true and correct *
                          </label>
                        </div>

                        <div className="flex items-start space-x-3 p-4 rounded-lg border-2 hover:border-primary/50 hover:bg-primary/5 transition-all">
                          <Checkbox
                            id="privacy"
                            checked={investorForm.privacyAccepted}
                            onCheckedChange={(checked) =>
                              handleInvestorCheckboxChange("privacyAccepted", checked as boolean)
                            }
                            className="border-2 mt-0.5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                            required
                          />
                          <label
                            htmlFor="privacy"
                            className="text-sm font-medium leading-relaxed cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            I agree to the{" "}
                            <Link href="/terms" className="text-primary hover:underline">
                              Terms & Conditions
                            </Link>{" "}
                            and{" "}
                            <Link href="/privacy" className="text-primary hover:underline">
                              Privacy Policy
                            </Link>{" "}
                            *
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold mb-2 text-blue-900 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5" />
                        What Happens Next?
                      </h4>
                      <ul className="space-y-2 text-sm text-blue-800">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>Your registration will be reviewed by our admin team within 2-3 business days</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>You'll receive email updates on your account approval status</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>Once approved, you can browse and invest in unlisted companies</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>Track your application status from your dashboard</span>
                        </li>
                      </ul>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity text-lg py-6"
                    >
                      Create Investor Account
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">
                      Already have an account?{" "}
                      <Link href="/login" className="text-primary hover:underline font-medium">
                        Log in
                      </Link>
                    </p>
                  </form>
                </TabsContent>

                <TabsContent value="company">
                  <form onSubmit={handleCompanySubmit} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="company-companyName">Company Name *</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="company-companyName"
                          name="companyName"
                          placeholder="Enter company name"
                          value={companyForm.companyName}
                          onChange={handleCompanyChange}
                          className={`pl-10 border-2 focus:border-primary transition-colors ${errors.companyName ? "border-red-500" : ""}`}
                          required
                        />
                      </div>
                      {errors.companyName && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.companyName}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company-contactPerson">Contact Person *</Label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="company-contactPerson"
                          name="contactPerson"
                          placeholder="Full name of authorized person"
                          value={companyForm.contactPerson}
                          onChange={handleCompanyChange}
                          className="pl-10 border-2 focus:border-primary transition-colors"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company-email">Company Email *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="company-email"
                          name="email"
                          type="email"
                          placeholder="company@example.com"
                          value={companyForm.email}
                          onChange={handleCompanyChange}
                          className={`pl-10 border-2 focus:border-primary transition-colors ${errors.companyEmail ? "border-red-500" : ""}`}
                          required
                        />
                      </div>
                      {errors.companyEmail && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.companyEmail}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company-phone">Contact Number *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="company-phone"
                          name="phone"
                          type="tel"
                          placeholder="+91 XXXXX XXXXX"
                          value={companyForm.phone}
                          onChange={handleCompanyChange}
                          className="pl-10 border-2 focus:border-primary transition-colors"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company-password">Password *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="company-password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a strong password"
                          value={companyForm.password}
                          onChange={handleCompanyChange}
                          className="pl-10 pr-10 border-2 focus:border-primary transition-colors"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {companyForm.password && (
                        <div className="space-y-1">
                          <div className="flex gap-1">
                            <div
                              className={`h-1 flex-1 rounded ${passwordStrength.bg} ${passwordStrength.level === "weak" ? "opacity-100" : "opacity-30"}`}
                            />
                            <div
                              className={`h-1 flex-1 rounded ${passwordStrength.bg} ${passwordStrength.level === "medium" || passwordStrength.level === "strong" ? "opacity-100" : "opacity-30"}`}
                            />
                            <div
                              className={`h-1 flex-1 rounded ${passwordStrength.bg} ${passwordStrength.level === "strong" ? "opacity-100" : "opacity-30"}`}
                            />
                          </div>
                          <p className={`text-xs ${passwordStrength.color} capitalize`}>
                            {passwordStrength.level} password
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company-confirmPassword">Confirm Password *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="company-confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Re-enter your password"
                          value={companyForm.confirmPassword}
                          onChange={handleCompanyChange}
                          className={`pl-10 pr-10 border-2 focus:border-primary transition-colors ${errors.companyConfirmPassword ? "border-red-500" : ""}`}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.companyConfirmPassword && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.companyConfirmPassword}
                        </p>
                      )}
                      {companyForm.confirmPassword &&
                        !errors.companyConfirmPassword &&
                        companyForm.password === companyForm.confirmPassword && (
                          <p className="text-sm text-green-500 flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Passwords match
                          </p>
                        )}
                    </div>

                    <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">
                        After creating your account, you'll need to complete the{" "}
                        <Link href="/company-registration" className="text-primary hover:underline font-medium">
                          company registration process
                        </Link>{" "}
                        to list your shares on UnlistX.
                      </p>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity text-lg py-6"
                    >
                      Create Company Account
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">
                      Already have an account?{" "}
                      <Link href="/login" className="text-primary hover:underline font-medium">
                        Log in
                      </Link>
                    </p>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to leave? Your progress will be saved as a draft.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Stay</AlertDialogCancel>
            <AlertDialogAction onClick={() => window.history.back()}>Leave</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
