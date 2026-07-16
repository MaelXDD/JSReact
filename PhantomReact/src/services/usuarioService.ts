import type { AuthResponse, UserResponse } from '@supabase/supabase-js'
import { supabase } from '../lib/supabaseClient'

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse['data']> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  },

  logout: async (): Promise<void> => {
    await supabase.auth.signOut()
  },

  getCurrentUser: (): Promise<UserResponse> => {
    return supabase.auth.getUser()
  },
}
