import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  /**
   * When set, only users with this role can access the route.
   * Users with a different role are redirected to their own dashboard.
   * When omitted, any authenticated user (regardless of role) can access the route.
   */
  allowedRole?: 'student' | 'professor'
}

export default function ProtectedRoute({ children, allowedRole }: ProtectedRouteProps) {
  const { user, role, loading } = useAuth()

  // Still resolving auth / role — show a minimal loader
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground text-sm animate-pulse">Loading...</div>
      </div>
    )
  }

  // Not authenticated → login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Role-restricted route: if role hasn't been assigned yet → select-role
  if (allowedRole && !role) {
    return <Navigate to="/select-role" replace />
  }

  // Role-restricted route: wrong role → redirect to correct dashboard
  if (allowedRole && role !== allowedRole) {
    return <Navigate to={role === 'professor' ? '/professor-dashboard' : '/student-dashboard'} replace />
  }

  return <>{children}</>
}