import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export default function Dashboard() {
  const { role, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground text-sm animate-pulse">Loading...</div>
      </div>
    )
  }

  if (role === 'professor') return <Navigate to="/professor-dashboard" replace />
  if (role === 'student') return <Navigate to="/student-dashboard" replace />

  // Role not set yet (shouldn't happen, but safety net)
  return <Navigate to="/select-role" replace />
}