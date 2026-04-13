import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { isAllowedEmail } from '@/lib/supabase'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleCallback = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()

      if (error || !session) {
        navigate('/login?error=auth_failed')
        return
      }

      const email = session.user.email ?? ''

      // Block non-cbit.org.in accounts
      if (!isAllowedEmail(email)) {
        await supabase.auth.signOut()
        navigate('/login?error=unauthorized_domain')
        return
      }

      // Check if profile exists (Google users need to pick a role)
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()

      if (!profile?.role) {
        // New Google user — send them to pick a role
        navigate('/select-role')
        return
      }

      // Existing user — go to dashboard
      navigate('/dashboard')
    }

    handleCallback()
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground text-sm animate-pulse">Signing you in...</p>
    </div>
  )
}