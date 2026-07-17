import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl: string | undefined = import.meta.env.VITE_SUPABASE_URL
const supabaseKey: string | undefined = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Faltan las variables de entorno de Supabase. Revisa tu archivo .env.local')
}

// Nota de seguridad: esta es la clave pública "anon" de Supabase, diseñada para
// exponerse en el cliente. La seguridad real de los datos depende de las
// políticas de Row Level Security (RLS) configuradas en el proyecto de Supabase,
// no de mantener esta clave en secreto.
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
  },
})