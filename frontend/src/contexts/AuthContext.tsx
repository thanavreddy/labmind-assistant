import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabase, isAllowedEmail } from '@/lib/supabase'

type Role = 'student' | 'professor' | null

interface AuthContextType {
  user: User | null
  session: Session | null
  role: Role
  loading: boolean
  signUpWithEmail: (email: string, password: string, fullName: string, role: Role) => Promise<{ error: string | null }>
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>
  signInWithGoogle: () => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [role, setRole] = useState<Role>(null)
  const [loading, setLoading] = useState(true)

  const fetchRole = async (userId: string): Promise<Role> => {
    const queryPromise: Promise<Role> = (async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', userId)
          .single()
        if (error) {
          console.error('Error fetching role:', error)
          return null
        }
        return (data?.role ?? null) as Role
      } catch (err) {
        console.error('fetchRole threw:', err)
        return null
      }
    })()

    // 4-second safety net — if Supabase hangs, resolve null instead of blocking forever
    const timeout: Promise<Role> = new Promise((resolve) =>
      setTimeout(() => {
        console.warn('fetchRole timed out after 4s, resolving null')
        resolve(null)
      }, 4000)
    )

    return Promise.race([queryPromise, timeout])
  }

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('onAuthStateChange fired', _event, session?.user?.email)
      
      setSession(session)
      setUser(session?.user ?? null)

      try {
        if (session?.user) {
          if (!isAllowedEmail(session.user.email ?? '')) {
            console.log('Email not allowed, signing out')
            await supabase.auth.signOut()
            setUser(null)
            setSession(null)
            setRole(null)
          } else {
            console.log('Fetching role for', session.user.id)
            const userRole = await fetchRole(session.user.id)
            console.log('Role fetched:', userRole)
            setRole(userRole)
          }
        } else {
          setRole(null)
        }
      } finally {
        // Always runs — even if fetchRole hangs and times out
        console.log('Setting loading to false')
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUpWithEmail = async (
    email: string,
    password: string,
    fullName: string,
    role: Role
  ): Promise<{ error: string | null }> => {
    if (!isAllowedEmail(email)) {
      return { error: `Only @cbit.org.in email addresses are allowed.` }
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role }
      }
    })

    if (error) return { error: error.message }
    if (!data.user) return { error: 'Signup failed. Please try again.' }

    return { error: null }
  }

  const signInWithEmail = async (email: string, password: string): Promise<{ error: string | null }> => {
    if (!isAllowedEmail(email)) {
      return { error: `Only @cbit.org.in email addresses are allowed.` }
    }

    console.log('Calling signInWithPassword...')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    console.log('signInWithPassword result:', error)

    if (error) return { error: error.message }
    return { error: null }
  }

  const signInWithGoogle = async (): Promise<{ error: string | null }> => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          hd: 'cbit.org.in'
        }
      }
    })

    if (error) return { error: error.message }
    return { error: null }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
    setRole(null)
  }

  return (
    <AuthContext.Provider value={{
      user,
      session,
      role,
      loading,
      signUpWithEmail,
      signInWithEmail,
      signInWithGoogle,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}