import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl: string | undefined = import.meta.env.VITE_SUPABASE_URL
const supabaseKey: string | undefined = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Faltan las variables de entorno de Supabase. Revisa tu archivo .env.local')
}


export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
  },
})