import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRole?: 'student' | 'professor'
}

export default function ProtectedRoute({ children, allowedRole }: ProtectedRouteProps) {
  const { user, role, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground text-sm animate-pulse">Loading...</div>
      </div>
    )
  }

  // Not logged in → go to login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Logged in but wrong role → redirect to their correct dashboard
  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}