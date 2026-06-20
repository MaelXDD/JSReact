// src/contexts/AuthContext.jsx
// ─────────────────────────────────────────────────────────
// Maneja la sesión de Supabase Auth y expone:
//   - user      → objeto de usuario de Supabase Auth
//   - profile   → fila de la tabla `usuarios` (con el rol)
//   - isAdmin   → booleano derivado del rol
//   - loading   → mientras se resuelve la sesión inicial
//   - login / logout
// ─────────────────────────────────────────────────────────
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // Carga el perfil extendido desde la tabla `usuarios`
  async function fetchProfile(authUser) {
    if (!authUser) { setProfile(null); return }
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', authUser.email)
      .single()
    if (!error) setProfile(data)
  }

  useEffect(() => {
    // 1. Sesión activa al montar
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null
      setUser(u)
      fetchProfile(u).finally(() => setLoading(false))
    })

    // 2. Escucha cambios de sesión (login / logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const u = session?.user ?? null
        setUser(u)
        fetchProfile(u)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // ── Acciones ──────────────────────────────────────────
  async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  async function logout() {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  const isAdmin = profile?.rol === 'ADMIN'

  return (
    <AuthContext.Provider value={{ user, profile, isAdmin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook de acceso rápido
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}
