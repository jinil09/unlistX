"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import {
  AlertCircle,
  CheckCircle2,
  Upload,
  X,
  Eye,
  EyeOff,
  Save,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRouter } from "next/navigation"

interface CompanyHolding {
  id: string
  companyName: string
  shareQuantity: string
  certificateNumber: string
  acquisitionDate: string
  acquisitionPrice: string
  expectedPrice: string
  proofDocument: File | null
}

export default function SecondarySellerRegistration() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [progress, setProgress] = useState(0)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const [formData, setFormData] = useState({
    // Step 1: Personal Information
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    panNumber: "",
    aadharNumber: "",

    // Step 2: Company Holdings (now an array)
    companyHoldings: [
      {
        id: "1",
        companyName: "",
        shareQuantity: "",
        certificateNumber: "",
        acquisitionDate: "",
        acquisitionPrice: "",
        expectedPrice: "",
        proofDocument: null as File | null,
      },
    ] as CompanyHolding[],

    // Step 3: Bank & Documents
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    accountHolderName: "",
    panCard: null as File | null,
    aadharCard: null as File | null,

    // Step 4: Additional Information
    reasonForSelling: "",
    urgency: "",
    additionalNotes: "",
    agreeToTerms: false,
  })

  // Auto-save to localStorage
  useEffect(() => {
    const savedData = localStorage.getItem("secondarySellerDraft")
    if (savedData) {
      const parsed = JSON.parse(savedData)
      // Ensure companyHoldings is an array and properly typed
      if (parsed.companyHoldings && Array.isArray(parsed.companyHoldings)) {
        parsed.companyHoldings = parsed.companyHoldings.map((holding: any) => ({
          ...holding,
          proofDocument: holding.proofDocument ? new File([], holding.proofDocument.name) : null, // Placeholder for file object
        }))
      } else {
        parsed.companyHoldings = [
          // Provide default if not present or malformed
          {
            id: Date.now().toString(),
            companyName: "",
            shareQuantity: "",
            certificateNumber: "",
            acquisitionDate: "",
            acquisitionPrice: "",
            expectedPrice: "",
            proofDocument: null,
          },
        ]
      }
      setFormData({ ...formData, ...parsed, companyHoldings: parsed.companyHoldings })
      setCurrentStep(parsed.currentStep || 1)
    }
  }, [])

  useEffect(() => {
    if (hasUnsavedChanges) {
      const dataToSave = { ...formData, currentStep }
      localStorage.setItem("secondarySellerDraft", JSON.stringify(dataToSave))
    }
  }, [formData, currentStep, hasUnsavedChanges])

  // Calculate progress
  useEffect(() => {
    // Adjust totalFields to only count relevant fields for progress calculation
    let totalFields = 0
    let filledFields = 0

    // Step 1 fields
    if (currentStep >= 1) {
      totalFields += 6 // fullName, email, phone, password, panNumber, aadharNumber
      filledFields += ["fullName", "email", "phone", "password", "panNumber", "aadharNumber"].filter(
        (field) => formData[field as keyof typeof formData] !== "",
      ).length
    }
    // Step 2 fields (for all company holdings)
    if (currentStep >= 2) {
      formData.companyHoldings.forEach((holding) => {
        totalFields += 7 // companyName, shareQuantity, certificateNumber, acquisitionDate, acquisitionPrice, expectedPrice, proofDocument
        filledFields += [
          holding.companyName,
          holding.shareQuantity,
          holding.certificateNumber,
          holding.acquisitionDate,
          holding.acquisitionPrice,
          holding.expectedPrice,
          holding.proofDocument,
        ].filter((value) => value !== "" && value !== null).length
      })
    }
    // Step 3 fields
    if (currentStep >= 3) {
      totalFields += 4 // bankName, accountNumber, ifscCode, accountHolderName, panCard, aadharCard
      filledFields += ["bankName", "accountNumber", "ifscCode", "accountHolderName", "panCard", "aadharCard"].filter(
        (field) => formData[field as keyof typeof formData] !== "" && formData[field as keyof typeof formData] !== null,
      ).length
    }
    // Step 4 fields
    if (currentStep >= 4) {
      totalFields += 3 // reasonForSelling, urgency, agreeToTerms (additionalNotes is optional)
      filledFields += ["reasonForSelling", "urgency", "agreeToTerms"].filter(
        (field) => formData[field as keyof typeof formData],
      ).length
    }

    setProgress(totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0)
  }, [formData, currentStep])

  // Warn before leaving
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

  const addCompanyHolding = () => {
    const newHolding: CompanyHolding = {
      id: Date.now().toString(),
      companyName: "",
      shareQuantity: "",
      certificateNumber: "",
      acquisitionDate: "",
      acquisitionPrice: "",
      expectedPrice: "",
      proofDocument: null,
    }
    setFormData({
      ...formData,
      companyHoldings: [...formData.companyHoldings, newHolding],
    })
    setHasUnsavedChanges(true)
  }

  const removeCompanyHolding = (id: string) => {
    if (formData.companyHoldings.length > 1) {
      setFormData({
        ...formData,
        companyHoldings: formData.companyHoldings.filter((h) => h.id !== id),
      })
      setHasUnsavedChanges(true)
    }
  }

  const updateCompanyHolding = (id: string, field: keyof CompanyHolding, value: any) => {
    setFormData({
      ...formData,
      companyHoldings: formData.companyHoldings.map((h) => (h.id === id ? { ...h, [field]: value } : h)),
    })
    setHasUnsavedChanges(true)
    // Validate the specific field within the holding if it has been touched
    if (touched[`company_${formData.companyHoldings.findIndex((h) => h.id === id)}_${field}`]) {
      validateCompanyHoldingField(
        id,
        field,
        value,
        formData.companyHoldings.findIndex((h) => h.id === id),
      )
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value })
    setHasUnsavedChanges(true)
    if (touched[field]) {
      validateField(field, value)
    }
  }

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true })
    validateField(field, formData[field as keyof typeof formData])
  }

  const validateField = (field: string, value: any) => {
    const newErrors = { ...errors }

    switch (field) {
      case "email":
        if (!value) {
          newErrors.email = "Email is required"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = "Invalid email format"
        } else {
          delete newErrors.email
        }
        break
      case "phone":
        if (!value) {
          newErrors.phone = "Phone number is required"
        } else if (!/^[6-9]\d{9}$/.test(value)) {
          newErrors.phone = "Invalid phone number (10 digits starting with 6-9)"
        } else {
          delete newErrors.phone
        }
        break
      case "password":
        if (!value) {
          newErrors.password = "Password is required"
        } else if (value.length < 8) {
          newErrors.password = "Password must be at least 8 characters"
        } else {
          delete newErrors.password
        }
        if (formData.confirmPassword && value !== formData.confirmPassword) {
          newErrors.confirmPassword = "Passwords do not match"
        } else if (formData.confirmPassword) {
          delete newErrors.confirmPassword
        }
        break
      case "confirmPassword":
        if (value !== formData.password) {
          newErrors.confirmPassword = "Passwords do not match"
        } else {
          delete newErrors.confirmPassword
        }
        break
      case "panNumber":
        if (!value) {
          newErrors.panNumber = "PAN number is required"
        } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value)) {
          newErrors.panNumber = "Invalid PAN format (e.g., ABCDE1234F)"
        } else {
          delete newErrors.panNumber
        }
        break
      case "aadharNumber":
        if (!value) {
          newErrors.aadharNumber = "Aadhar number is required"
        } else if (!/^\d{12}$/.test(value)) {
          newErrors.aadharNumber = "Aadhar must be 12 digits"
        } else {
          delete newErrors.aadharNumber
        }
        break
      case "ifscCode":
        if (!value) {
          newErrors.ifscCode = "IFSC code is required"
        } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(value)) {
          newErrors.ifscCode = "Invalid IFSC format"
        } else {
          delete newErrors.ifscCode
        }
        break
    }

    setErrors(newErrors)
  }

  // Added validation for company holdings
  const validateCompanyHoldingField = (id: string, field: keyof CompanyHolding, value: any, index: number) => {
    const newErrors = { ...errors }
    const errorKeyPrefix = `company_${index}_`

    switch (field) {
      case "companyName":
        if (!value) newErrors[`${errorKeyPrefix}name`] = "Company name is required"
        else delete newErrors[`${errorKeyPrefix}name`]
        break
      case "shareQuantity":
        if (!value) newErrors[`${errorKeyPrefix}quantity`] = "Share quantity is required"
        else delete newErrors[`${errorKeyPrefix}quantity`]
        break
      case "certificateNumber":
        // Corrected errorKeyKey to errorKeyPrefix
        if (!value) newErrors[`${errorKeyPrefix}certificate`] = "Certificate number is required"
        else delete newErrors[`${errorKeyPrefix}certificate`]
        break
      case "acquisitionDate":
        if (!value) newErrors[`${errorKeyPrefix}date`] = "Acquisition date is required"
        else delete newErrors[`${errorKeyPrefix}date`]
        break
      case "acquisitionPrice":
        if (!value) newErrors[`${errorKeyPrefix}acqPrice`] = "Acquisition price is required"
        else delete newErrors[`${errorKeyPrefix}acqPrice`]
        break
      case "expectedPrice":
        if (!value) newErrors[`${errorKeyPrefix}expPrice`] = "Expected price is required"
        else delete newErrors[`${errorKeyPrefix}expPrice`]
        break
      case "proofDocument":
        if (!value) newErrors[`${errorKeyPrefix}proof`] = "Proof document (PDF) is required"
        else delete newErrors[`${errorKeyPrefix}proof`]
        break
    }
    setErrors(newErrors)
  }

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!formData.fullName) newErrors.fullName = "Full name is required"
      if (!formData.email) newErrors.email = "Email is required"
      if (!formData.phone) newErrors.phone = "Phone is required"
      if (!formData.password) newErrors.password = "Password is required"
      if (!formData.confirmPassword) newErrors.confirmPassword = "Confirm password is required"
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match"
      if (!formData.panNumber) newErrors.panNumber = "PAN is required"
      if (!formData.aadharNumber) newErrors.aadharNumber = "Aadhar is required"
    } else if (step === 2) {
      formData.companyHoldings.forEach((holding, index) => {
        if (!holding.companyName) newErrors[`company_${index}_name`] = "Company name is required"
        if (!holding.shareQuantity) newErrors[`company_${index}_quantity`] = "Share quantity is required"
        if (!holding.certificateNumber) newErrors[`company_${index}_certificate`] = "Certificate number is required"
        if (!holding.acquisitionDate) newErrors[`company_${index}_date`] = "Acquisition date is required"
        if (!holding.acquisitionPrice) newErrors[`company_${index}_acqPrice`] = "Acquisition price is required"
        if (!holding.expectedPrice) newErrors[`company_${index}_expPrice`] = "Expected price is required"
        if (!holding.proofDocument) newErrors[`company_${index}_proof`] = "Proof document (PDF) is required"
      })
    } else if (step === 3) {
      if (!formData.bankName) newErrors.bankName = "Bank name is required"
      if (!formData.accountNumber) newErrors.accountNumber = "Account number is required"
      if (!formData.ifscCode) newErrors.ifscCode = "IFSC code is required"
      if (!formData.accountHolderName) newErrors.accountHolderName = "Account holder name is required"
      if (!formData.panCard) newErrors.panCard = "PAN card is required"
      if (!formData.aadharCard) newErrors.aadharCard = "Aadhar card is required"
    } else if (step === 4) {
      if (!formData.reasonForSelling) newErrors.reasonForSelling = "Reason for selling is required"
      if (!formData.urgency) newErrors.urgency = "Urgency level is required"
      if (!formData.agreeToTerms) newErrors.agreeToTerms = "You must agree to terms"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleFileUpload = (field: string, file: File | null) => {
    setFormData({ ...formData, [field]: file })
    setHasUnsavedChanges(true)
    // Validate the file upload field if it has been touched
    if (touched[field]) {
      validateField(field, file)
    }
  }

  const handleSaveProgress = () => {
    const dataToSave = { ...formData, currentStep }
    localStorage.setItem("secondarySellerDraft", JSON.stringify(dataToSave))
    setHasUnsavedChanges(false)
    alert("Progress saved successfully!")
  }

  const handleSubmit = () => {
    if (validateStep(4)) {
      setShowConfirmDialog(true)
    }
  }

  const confirmSubmit = () => {
    console.log("Secondary Seller Registration:", formData)
    localStorage.removeItem("secondarySellerDraft")
    setHasUnsavedChanges(false)
    router.push("/seller/pending")
  }

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: "", color: "" }
    let strength = 0
    if (password.length >= 8) strength++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[^a-zA-Z0-9]/.test(password)) strength++

    const labels = ["", "Weak", "Fair", "Good", "Strong"]
    const colors = ["", "bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500"]
    return { strength, label: labels[strength], color: colors[strength] }
  }

  const passwordStrength = getPasswordStrength(formData.password)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navigation />

      {/* Sticky Header with Progress */}
      <div className="sticky top-[73px] z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Secondary Seller Registration</h1>
              <p className="text-sm text-gray-600">Step {currentStep} of 4</p>
            </div>
            <Button onClick={handleSaveProgress} variant="outline" size="sm" className="gap-2 bg-transparent">
              <Save className="h-4 w-4" />
              Save Progress
            </Button>
          </div>
          <div className="space-y-2">
            <Progress value={(currentStep / 4) * 100} className="h-2" />
            <div className="flex justify-between text-xs text-gray-600">
              <span className={currentStep >= 1 ? "text-blue-600 font-medium" : ""}>Personal Info</span>
              <span className={currentStep >= 2 ? "text-blue-600 font-medium" : ""}>Share Holdings</span>
              <span className={currentStep >= 3 ? "text-blue-600 font-medium" : ""}>Bank & Documents</span>
              <span className={currentStep >= 4 ? "text-blue-600 font-medium" : ""}>Review & Submit</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl">
              {currentStep === 1 && "Personal Information"}
              {currentStep === 2 && "Share Holdings"}
              {currentStep === 3 && "Bank & Documents"}
              {currentStep === 4 && "Additional Information"}
            </CardTitle>
            <CardDescription className="text-purple-100">
              {currentStep === 1 && "Tell us about yourself"}
              {currentStep === 2 && "Add all companies whose shares you want to sell"}
              {currentStep === 3 && "Banking information and identity documents"}
              {currentStep === 4 && "Final details and confirmation"}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    onBlur={() => handleBlur("fullName")}
                    placeholder="Enter your full name"
                    className={errors.fullName ? "border-red-500" : ""}
                  />
                  {errors.fullName && (
                    <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.fullName}
                    </p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      onBlur={() => handleBlur("email")}
                      placeholder="your.email@example.com"
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      onBlur={() => handleBlur("phone")}
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      className={errors.phone ? "border-red-500" : ""}
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="password">Password *</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        onBlur={() => handleBlur("password")}
                        placeholder="Create a strong password"
                        className={errors.password ? "border-red-500" : ""}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {formData.password && (
                      <div className="mt-2 space-y-1">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              className={`h-1 flex-1 rounded ${
                                i <= passwordStrength.strength ? passwordStrength.color : "bg-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-gray-600">{passwordStrength.label}</p>
                      </div>
                    )}
                    {errors.password && (
                      <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {errors.password}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        onBlur={() => handleBlur("confirmPassword")}
                        placeholder="Re-enter your password"
                        className={errors.confirmPassword ? "border-red-500" : ""}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {formData.confirmPassword && formData.password === formData.confirmPassword && (
                      <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Passwords match
                      </p>
                    )}
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="panNumber">PAN Number *</Label>
                    <Input
                      id="panNumber"
                      value={formData.panNumber}
                      onChange={(e) => handleInputChange("panNumber", e.target.value.toUpperCase())}
                      onBlur={() => handleBlur("panNumber")}
                      placeholder="ABCDE1234F"
                      maxLength={10}
                      className={errors.panNumber ? "border-red-500" : ""}
                    />
                    {errors.panNumber && (
                      <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {errors.panNumber}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="aadharNumber">Aadhar Number *</Label>
                    <Input
                      id="aadharNumber"
                      value={formData.aadharNumber}
                      onChange={(e) => handleInputChange("aadharNumber", e.target.value)}
                      onBlur={() => handleBlur("aadharNumber")}
                      placeholder="12-digit Aadhar number"
                      maxLength={12}
                      className={errors.aadharNumber ? "border-red-500" : ""}
                    />
                    {errors.aadharNumber && (
                      <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {errors.aadharNumber}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Share Holdings - UPDATED TO SUPPORT MULTIPLE COMPANIES */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <Alert className="bg-blue-50 border-blue-200">
                  <AlertDescription className="text-sm text-blue-800">
                    Add all companies whose shares you want to sell. You can add multiple companies by clicking "Add
                    Another Company" button.
                  </AlertDescription>
                </Alert>

                {formData.companyHoldings.map((holding, index) => (
                  <Card key={holding.id} className="border-2 border-gray-200">
                    <CardHeader className="bg-gray-50 pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Company {index + 1}</CardTitle>
                        {formData.companyHoldings.length > 1 && (
                          <Button
                            onClick={() => removeCompanyHolding(holding.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-4">
                      <div>
                        <Label htmlFor={`companyName-${holding.id}`}>Company Name *</Label>
                        <Input
                          id={`companyName-${holding.id}`}
                          value={holding.companyName}
                          onChange={(e) => updateCompanyHolding(holding.id, "companyName", e.target.value)}
                          onBlur={(e) => {
                            setTouched({ ...touched, [`company_${index}_companyName`]: true })
                            validateCompanyHoldingField(holding.id, "companyName", e.target.value, index)
                          }}
                          placeholder="Name of the company"
                          className={errors[`company_${index}_name`] ? "border-red-500" : ""}
                        />
                        {errors[`company_${index}_name`] && (
                          <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" /> {errors[`company_${index}_name`]}
                          </p>
                        )}
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`shareQuantity-${holding.id}`}>Number of Shares *</Label>
                          <Input
                            id={`shareQuantity-${holding.id}`}
                            type="number"
                            value={holding.shareQuantity}
                            onChange={(e) => updateCompanyHolding(holding.id, "shareQuantity", e.target.value)}
                            onBlur={(e) => {
                              setTouched({ ...touched, [`company_${index}_shareQuantity`]: true })
                              validateCompanyHoldingField(holding.id, "shareQuantity", e.target.value, index)
                            }}
                            placeholder="e.g., 1000"
                            className={errors[`company_${index}_quantity`] ? "border-red-500" : ""}
                          />
                          {errors[`company_${index}_quantity`] && (
                            <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" /> {errors[`company_${index}_quantity`]}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor={`certificateNumber-${holding.id}`}>Certificate Number *</Label>
                          <Input
                            id={`certificateNumber-${holding.id}`}
                            value={holding.certificateNumber}
                            onChange={(e) => updateCompanyHolding(holding.id, "certificateNumber", e.target.value)}
                            onBlur={(e) => {
                              setTouched({ ...touched, [`company_${index}_certificateNumber`]: true })
                              validateCompanyHoldingField(holding.id, "certificateNumber", e.target.value, index)
                            }}
                            placeholder="Share certificate number"
                            className={errors[`company_${index}_certificate`] ? "border-red-500" : ""}
                          />
                          {errors[`company_${index}_certificate`] && (
                            <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" /> {errors[`company_${index}_certificate`]}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`acquisitionDate-${holding.id}`}>Acquisition Date *</Label>
                          <Input
                            id={`acquisitionDate-${holding.id}`}
                            type="date"
                            value={holding.acquisitionDate}
                            onChange={(e) => updateCompanyHolding(holding.id, "acquisitionDate", e.target.value)}
                            onBlur={(e) => {
                              setTouched({ ...touched, [`company_${index}_acquisitionDate`]: true })
                              validateCompanyHoldingField(holding.id, "acquisitionDate", e.target.value, index)
                            }}
                            className={errors[`company_${index}_date`] ? "border-red-500" : ""}
                          />
                          {errors[`company_${index}_date`] && (
                            <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" /> {errors[`company_${index}_date`]}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor={`acquisitionPrice-${holding.id}`}>Acquisition Price per Share (₹) *</Label>
                          <Input
                            id={`acquisitionPrice-${holding.id}`}
                            type="number"
                            value={holding.acquisitionPrice}
                            onChange={(e) => updateCompanyHolding(holding.id, "acquisitionPrice", e.target.value)}
                            onBlur={(e) => {
                              setTouched({ ...touched, [`company_${index}_acquisitionPrice`]: true })
                              validateCompanyHoldingField(holding.id, "acquisitionPrice", e.target.value, index)
                            }}
                            placeholder="e.g., 100"
                            className={errors[`company_${index}_acqPrice`] ? "border-red-500" : ""}
                          />
                          {errors[`company_${index}_acqPrice`] && (
                            <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" /> {errors[`company_${index}_acqPrice`]}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor={`expectedPrice-${holding.id}`}>Expected Selling Price per Share (₹) *</Label>
                        <Input
                          id={`expectedPrice-${holding.id}`}
                          type="number"
                          value={holding.expectedPrice}
                          onChange={(e) => updateCompanyHolding(holding.id, "expectedPrice", e.target.value)}
                          onBlur={(e) => {
                            setTouched({ ...touched, [`company_${index}_expectedPrice`]: true })
                            validateCompanyHoldingField(holding.id, "expectedPrice", e.target.value, index)
                          }}
                          placeholder="Your asking price"
                          className={errors[`company_${index}_expPrice`] ? "border-red-500" : ""}
                        />
                        {errors[`company_${index}_expPrice`] && (
                          <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" /> {errors[`company_${index}_expPrice`]}
                          </p>
                        )}
                      </div>

                      {holding.acquisitionPrice && holding.expectedPrice && holding.shareQuantity && (
                        <Alert className="bg-green-50 border-green-200">
                          <AlertDescription className="text-sm text-green-800">
                            <strong>Potential Return:</strong>{" "}
                            {(
                              ((Number(holding.expectedPrice) - Number(holding.acquisitionPrice)) /
                                Number(holding.acquisitionPrice)) *
                              100
                            ).toFixed(2)}
                            % | <strong>Total Value:</strong> ₹
                            {(Number(holding.expectedPrice) * Number(holding.shareQuantity)).toLocaleString()}
                          </AlertDescription>
                        </Alert>
                      )}

                      <div>
                        <Label htmlFor={`proofDocument-${holding.id}`}>Proof of Ownership (PDF Only) *</Label>
                        <p className="text-xs text-gray-500 mb-2">Upload share certificate or ownership proof as PDF</p>
                        <div className="mt-2">
                          <label
                            htmlFor={`proofDocument-${holding.id}`}
                            className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-purple-500 transition-colors"
                          >
                            <Upload className="h-5 w-5 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {holding.proofDocument ? holding.proofDocument.name : "Upload PDF Proof"}
                            </span>
                          </label>
                          <input
                            id={`proofDocument-${holding.id}`}
                            type="file"
                            accept=".pdf"
                            onChange={(e) => {
                              updateCompanyHolding(holding.id, "proofDocument", e.target.files?.[0] || null)
                              setTouched({ ...touched, [`company_${index}_proofDocument`]: true })
                              validateCompanyHoldingField(
                                holding.id,
                                "proofDocument",
                                e.target.files?.[0] || null,
                                index,
                              )
                            }}
                            className="hidden"
                          />
                          {holding.proofDocument && (
                            <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                              <CheckCircle2 className="h-4 w-4" />
                              <span>{holding.proofDocument.name}</span>
                              <button
                                onClick={() => {
                                  updateCompanyHolding(holding.id, "proofDocument", null)
                                  setTouched({ ...touched, [`company_${index}_proofDocument`]: false }) // Reset touched on clear
                                }}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                          {errors[`company_${index}_proof`] && (
                            <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" /> {errors[`company_${index}_proof`]}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Button
                  onClick={addCompanyHolding}
                  variant="outline"
                  className="w-full border-2 border-dashed border-purple-300 hover:border-purple-500 hover:bg-purple-50 text-purple-600 bg-transparent"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Company
                </Button>
              </div>
            )}

            {/* Step 3: Bank & Documents */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bankName">Bank Name *</Label>
                    <Input
                      id="bankName"
                      value={formData.bankName}
                      onChange={(e) => handleInputChange("bankName", e.target.value)}
                      onBlur={() => handleBlur("bankName")}
                      placeholder="e.g., HDFC Bank"
                      className={errors.bankName ? "border-red-500" : ""}
                    />
                    {errors.bankName && (
                      <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {errors.bankName}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="accountHolderName">Account Holder Name *</Label>
                    <Input
                      id="accountHolderName"
                      value={formData.accountHolderName}
                      onChange={(e) => handleInputChange("accountHolderName", e.target.value)}
                      onBlur={() => handleBlur("accountHolderName")}
                      placeholder="As per bank records"
                      className={errors.accountHolderName ? "border-red-500" : ""}
                    />
                    {errors.accountHolderName && (
                      <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {errors.accountHolderName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="accountNumber">Account Number *</Label>
                    <Input
                      id="accountNumber"
                      value={formData.accountNumber}
                      onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                      onBlur={() => handleBlur("accountNumber")}
                      placeholder="Bank account number"
                      className={errors.accountNumber ? "border-red-500" : ""}
                    />
                    {errors.accountNumber && (
                      <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {errors.accountNumber}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="ifscCode">IFSC Code *</Label>
                    <Input
                      id="ifscCode"
                      value={formData.ifscCode}
                      onChange={(e) => handleInputChange("ifscCode", e.target.value.toUpperCase())}
                      onBlur={() => handleBlur("ifscCode")}
                      placeholder="e.g., HDFC0001234"
                      maxLength={11}
                      className={errors.ifscCode ? "border-red-500" : ""}
                    />
                    {errors.ifscCode && (
                      <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {errors.ifscCode}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <h3 className="font-semibold text-gray-900">Identity Documents (PDF Only)</h3>

                  <div>
                    <Label htmlFor="panCard">PAN Card * (PDF Only)</Label>
                    <div className="mt-2">
                      <label
                        htmlFor="panCard"
                        className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-colors"
                      >
                        <Upload className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {formData.panCard ? formData.panCard.name : "Upload PAN Card PDF"}
                        </span>
                      </label>
                      <input
                        id="panCard"
                        type="file"
                        accept=".pdf"
                        onChange={(e) => handleFileUpload("panCard", e.target.files?.[0] || null)}
                        className="hidden"
                      />
                      {formData.panCard && (
                        <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>{formData.panCard.name}</span>
                          <button
                            onClick={() => handleFileUpload("panCard", null)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                      {errors.panCard && (
                        <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> {errors.panCard}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="aadharCard">Aadhar Card * (PDF Only)</Label>
                    <div className="mt-2">
                      <label
                        htmlFor="aadharCard"
                        className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-colors"
                      >
                        <Upload className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {formData.aadharCard ? formData.aadharCard.name : "Upload Aadhar Card PDF"}
                        </span>
                      </label>
                      <input
                        id="aadharCard"
                        type="file"
                        accept=".pdf"
                        onChange={(e) => handleFileUpload("aadharCard", e.target.files?.[0] || null)}
                        className="hidden"
                      />
                      {formData.aadharCard && (
                        <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>{formData.aadharCard.name}</span>
                          <button
                            onClick={() => handleFileUpload("aadharCard", null)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                      {errors.aadharCard && (
                        <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> {errors.aadharCard}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Additional Information */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="reasonForSelling">Reason for Selling *</Label>
                  <Select
                    value={formData.reasonForSelling}
                    onValueChange={(value) => handleInputChange("reasonForSelling", value)}
                  >
                    <SelectTrigger className={errors.reasonForSelling ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="liquidity">Need Liquidity</SelectItem>
                      <SelectItem value="portfolio">Portfolio Rebalancing</SelectItem>
                      <SelectItem value="profit">Profit Booking</SelectItem>
                      <SelectItem value="emergency">Financial Emergency</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.reasonForSelling && (
                    <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.reasonForSelling}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="urgency">Urgency Level *</Label>
                  <Select value={formData.urgency} onValueChange={(value) => handleInputChange("urgency", value)}>
                    <SelectTrigger className={errors.urgency ? "border-red-500" : ""}>
                      <SelectValue placeholder="How urgent is the sale?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate (Within 1 week)</SelectItem>
                      <SelectItem value="soon">Soon (Within 1 month)</SelectItem>
                      <SelectItem value="flexible">Flexible (Within 3 months)</SelectItem>
                      <SelectItem value="no-rush">No Rush (Open to best offer)</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.urgency && (
                    <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.urgency}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="additionalNotes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={(e) => handleInputChange("additionalNotes", e.target.value)}
                    placeholder="Any additional information you'd like to share..."
                    rows={4}
                  />
                </div>

                <Alert className="bg-blue-50 border-blue-200">
                  <AlertDescription className="text-sm text-blue-800">
                    <strong>What happens next?</strong>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Our team will review your submission within 2-3 business days</li>
                      <li>We'll verify your documents and share ownership</li>
                      <li>Once approved, your shares will be listed on our secondary market</li>
                      <li>You'll be notified when potential buyers express interest</li>
                      <li>We'll facilitate the transaction and ensure secure settlement</li>
                    </ul>
                  </AlertDescription>
                </Alert>

                <div className="flex items-start gap-2 pt-4">
                  <Checkbox
                    id="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked)}
                  />
                  <Label htmlFor="agreeToTerms" className="text-sm leading-relaxed cursor-pointer">
                    I agree to the{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Terms & Conditions
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Privacy Policy
                    </a>
                    . I confirm that all information provided is accurate and I have the legal right to sell these
                    shares.
                  </Label>
                </div>
                {errors.agreeToTerms && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.agreeToTerms}
                  </p>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t">
              {currentStep > 1 && (
                <Button onClick={handlePrevious} variant="outline" className="gap-2 bg-transparent">
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>
              )}
              {currentStep < 4 ? (
                <Button onClick={handleNext} className="ml-auto gap-2 bg-gradient-to-r from-purple-600 to-pink-600">
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="ml-auto gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  Submit Registration
                  <CheckCircle2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle>Confirm Submission</CardTitle>
              <CardDescription>Are you sure you want to submit your registration?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Please review all information before submitting. Once submitted, you cannot edit your application during
                the review process.
              </p>
              <div className="flex gap-3">
                <Button onClick={() => setShowConfirmDialog(false)} variant="outline" className="flex-1">
                  Review Again
                </Button>
                <Button onClick={confirmSubmit} className="flex-1 bg-green-600 hover:bg-green-700">
                  Confirm & Submit
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
