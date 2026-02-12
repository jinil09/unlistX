import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './use-auth'

export function useProtectedRoute(requiredUserType?: string) {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login')
        return
      }

      if (requiredUserType && user?.userType !== requiredUserType) {
        // Redirect to appropriate dashboard based on user type
        switch (user?.userType) {
          case 'investor':
            router.push('/investor/dashboard')
            break
          case 'company':
            router.push('/company/dashboard')
            break
          case 'seller':
            router.push('/seller/dashboard')
            break
          case 'admin':
            router.push('/admin/dashboard')
            break
          default:
            router.push('/')
        }
      }
    }
  }, [isAuthenticated, isLoading, user, requiredUserType, router])

  return { user, isLoading }
}