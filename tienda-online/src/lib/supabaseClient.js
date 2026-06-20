// src/lib/supabaseClient.js
// ─────────────────────────────────────────────────────────
// Cliente oficial de Supabase. Se instancia UNA sola vez y
// se importa desde cualquier parte de la app.
// ─────────────────────────────────────────────────────────
import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Faltan las variables de entorno de Supabase. Revisa tu archivo .env.local')
}

export const supabase = createClient(supabaseUrl, supabaseKey)
