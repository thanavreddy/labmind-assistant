import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuth, writeCachedRole } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'

type Role = 'student' | 'professor'

const DEST = (r: Role) => r === 'student' ? '/student-dashboard' : '/professor-dashboard'

/** Race a promise against a timeout. Rejects with an Error on timeout. */
function withTimeout<T>(promise: Promise<T>, ms: number, message: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(message)), ms)
    ),
  ])
}

export default function SelectRole() {
  const { user, role: authRole, loading: authLoading, setRoleDirectly } = useAuth()
  const navigate = useNavigate()
  const [role, setRole] = useState<Role>('student')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // If user already has a role, skip this page
  useEffect(() => {
    if (!authLoading && authRole) {
      navigate(DEST(authRole), { replace: true })
    }
  }, [authRole, authLoading, navigate])

  const handleConfirm = async () => {
    if (!user || saving) return

    setSaving(true)
    setError(null)

    try {
      const { error: upsertErr } = await withTimeout(
        supabase.from('profiles').upsert({
          id: user.id,
          email: user.email,       // NOT NULL in schema
          full_name: user.user_metadata?.full_name ?? '',
          role,
        }) as unknown as Promise<{ error: Error | null }>,
        12000,
        'Request timed out. Please check your connection and try again.'
      )

      if (upsertErr) {
        throw new Error(upsertErr.message ?? 'Failed to save role.')
      }

      // ── Update state & cache immediately — no round-trip needed ──────────
      writeCachedRole(user.id, role)  // so next page loads instantly
      setRoleDirectly(role)           // update AuthContext state right now

      navigate(DEST(role), { replace: true })
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      setError(msg)
      console.error('[SelectRole] save error:', err)
    } finally {
      // Always re-enable the button — even if the request hung
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <h1 className="text-2xl font-bold">One last step</h1>
        <p className="text-muted-foreground text-sm">
          How will you be using LabMind?
        </p>

        {error && (
          <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setRole('student')}
            disabled={saving}
            className={`p-6 rounded-lg border-2 text-left transition-all disabled:opacity-50 ${
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
            disabled={saving}
            className={`p-6 rounded-lg border-2 text-left transition-all disabled:opacity-50 ${
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
          id="select-role-confirm-btn"
          className="w-full"
          onClick={handleConfirm}
          disabled={saving}
        >
          {saving
            ? 'Saving…'
            : `Continue as ${role === 'student' ? 'Student' : 'Teacher'}`}
        </Button>

        {saving && (
          <p className="text-xs text-muted-foreground">
            Connecting to server… this may take a moment.
          </p>
        )}
      </div>
    </div>
  )
}