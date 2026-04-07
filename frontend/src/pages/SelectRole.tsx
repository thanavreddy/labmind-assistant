import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'

type Role = 'student' | 'professor'

export default function SelectRole() {
  const { user, role: authRole, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [role, setRole] = useState<Role>('student')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // If auth context already has a role (e.g. INITIAL_SESSION resolved after SIGNED_IN),
  // skip this page and go straight to the correct dashboard
  useEffect(() => {
    if (!authLoading && authRole) {
      navigate(
        authRole === 'student' ? '/student-dashboard' : '/professor-dashboard',
        { replace: true }
      )
    }
  }, [authRole, authLoading, navigate])

  const handleConfirm = async () => {
    if (!user) return
    setLoading(true)
    setError(null)

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        email: user.email,          // NOT NULL in schema — must include
        role,
        full_name: user.user_metadata?.full_name ?? '',
      })

    if (error) {
      console.error('Profile upsert error:', error)
      setError(error.message)
      setLoading(false)
      return
    }

    navigate(role === 'student' ? '/student-dashboard' : '/professor-dashboard')
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <h1 className="text-2xl font-bold">One last step</h1>
        <p className="text-muted-foreground text-sm">
          How will you be using LabMind?
        </p>

        {error && (
          <div className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setRole('student')}
            className={`p-6 rounded-lg border-2 text-left transition-all ${
              role === 'student'
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/40'
            }`}
          >
            <div className="text-3xl mb-2">🎓</div>
            <div className="font-medium">Student</div>
            <div className="text-xs text-muted-foreground mt-1">
              Complete lab experiments
            </div>
          </button>

          <button
            type="button"
            onClick={() => setRole('professor')}
            className={`p-6 rounded-lg border-2 text-left transition-all ${
              role === 'professor'
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/40'
            }`}
          >
            <div className="text-3xl mb-2">👩‍🏫</div>
            <div className="font-medium">Teacher</div>
            <div className="text-xs text-muted-foreground mt-1">
              Manage and review students
            </div>
          </button>
        </div>

        <Button
          className="w-full"
          onClick={handleConfirm}
          disabled={loading}
        >
          {loading
            ? 'Saving...'
            : `Continue as ${role === 'student' ? 'Student' : 'Professor'}`}
        </Button>
      </div>
    </div>
  )
}