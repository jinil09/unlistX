"use client"

import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { useState } from "react"
import { User, LogOut } from "lucide-react"

export function Navigation() {
  const { user, isAuthenticated, logout } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    if (isLoggingOut) return
    
    setIsLoggingOut(true)
    try {
      // Call your logout API if you have one
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch (error) {
      console.error('Logout API call failed:', error)
    } finally {
      // Always call the Zustand logout to clear local state
      logout()
      setIsLoggingOut(false)
      // Optional: Redirect to home page
      window.location.href = '/'
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Logo className="text-gray-900" />
          <div className="hidden md:flex items-center gap-6">
            <Link href="/companies" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
              Companies
            </Link>
            {/* <Link href="/secondary-market" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
              Secondary Market
            </Link> */}
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-4">
                {/* User Profile */}
                <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1.5">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <User className="h-3 w-3 text-white" />
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-gray-900 capitalize">
                      {user.name || user.email?.split('@')[0] || 'User'}
                    </div>
                    <div className="text-xs text-gray-500 capitalize">
                      {user.userType?.toLowerCase() || 'user'}
                    </div>
                  </div>
                </div>

                {/* Dashboard Link */}
                <Link href="/dashboard">
                  <Button variant="outline" size="sm" className="text-gray-700 border-gray-300">
                    Dashboard
                  </Button>
                </Link>

                {/* Logout Button */}
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="text-gray-700 hover:text-gray-900 disabled:opacity-50"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              /* Show Login/Register when not authenticated */
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-gray-700 hover:text-gray-900">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}