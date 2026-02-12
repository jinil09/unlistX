"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, LogIn, ArrowRight } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export default function LoginPage() {
  const router = useRouter()
  const { user, isAuthenticated, login, setLoading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      redirectBasedOnUserType(user.userType)
    }
  }, [isAuthenticated, user])

  const redirectBasedOnUserType = (userType: string) => {
    router.push('/')
    // switch (userType) {
    //   case 'investor':
    //     router.push('/investor/dashboard')
    //     break
    //   case 'company':
    //     router.push('/company/dashboard')
    //     break
    //   case 'seller':
    //     router.push('/seller/dashboard')
    //     break
    //   case 'admin':
    //     router.push('/admin/dashboard')
    //     break
    //   default:
    //     router.push('/')
    // }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        login(result.user)
        redirectBasedOnUserType(result.user.userType)
      } else {
        setError(result.error || 'Login failed')
      }
    } catch (error) {
      setError('An error occurred during login')
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[80vh]">
        <div className="w-full max-w-md">
          <Card className="p-6 border-2 shadow-xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center mx-auto mb-4">
                <LogIn className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome Back</h1>
              <p className="text-slate-600">Sign in to your account</p>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="border-2 focus:border-blue-600 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="border-2 focus:border-blue-600 transition-colors pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {isLoading ? "Signing in..." : "Sign In"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>

            <div className="mt-6 text-center space-y-3">
              <p className="text-sm text-slate-600">
                Don't have an account?{" "}
                <Link href="/register" className="text-blue-600 hover:underline font-medium">
                  Sign up
                </Link>
              </p>
              <div className="flex justify-center space-x-4 text-sm">
                <Link href="/forgot-password" className="text-slate-600 hover:text-slate-900 hover:underline">
                  Forgot Password?
                </Link>
              </div>
            </div>
          </Card>

          {/* Registration Options */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 text-center border-2 hover:shadow-lg transition-all cursor-pointer bg-white">
              <Link href="/register?type=investor" className="block">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">I</span>
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">Investor</h3>
                <p className="text-xs text-slate-600">Browse investment opportunities</p>
              </Link>
            </Card>

            <Card className="p-4 text-center border-2 hover:shadow-lg transition-all cursor-pointer bg-white">
              <Link href="/register?type=company" className="block">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 font-bold">C</span>
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">Company</h3>
                <p className="text-xs text-slate-600">Raise funds for your business</p>
              </Link>
            </Card>

            <Card className="p-4 text-center border-2 hover:shadow-lg transition-all cursor-pointer bg-white">
              <Link href="/register?type=seller" className="block">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                  <span className="text-purple-600 font-bold">S</span>
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">Seller</h3>
                <p className="text-xs text-slate-600">Sell your private shares</p>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}