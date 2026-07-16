import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabaseClient'
import { authService } from '../services/usuarioService'
import type { Usuario } from '../domain/entities'

interface AuthContextValue {
  user: User | null
  profile: Usuario | null
  isAdmin: boolean
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

async function login(email: string, password: string): Promise<void> {
  await authService.login(email, password)
}

export function AuthProvider({ children }: { readonly children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Usuario | null>(null)
  const [loading, setLoading] = useState(true)

  // Carga el perfil extendido desde la tabla `usuarios`
  async function fetchProfile(authUser: User | null): Promise<void> {
    if (!authUser) {
      setProfile(null)
      return
    }
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', authUser.email)
      .single()
    if (!error) setProfile(data as Usuario)
  }

  useEffect(() => {
    // Sesión activa al montar
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null
      setUser(u)
      fetchProfile(u).finally(() => setLoading(false))
    })

    // Escucha cambios de sesión
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const u = session?.user ?? null
        setUser(u)
        fetchProfile(u)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  async function logout(): Promise<void> {
    await authService.logout()
    setUser(null)
    setProfile(null)
  }

  const isAdmin = profile?.rol === 'ADMIN'

  const value = useMemo(
    () => ({ user, profile, isAdmin, loading, login, logout }),
    [user, profile, isAdmin, loading]
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook de acceso rápido
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}
