import { supabase } from '../lib/supabaseClient'
import type { Categoria } from '../domain/entities'

export async function getCategorias(): Promise<Categoria[]> {
  const { data, error } = await supabase
    .from('categorias')
    .select('id, nombre')
    .order('nombre')

  if (error) throw error
  return data ?? []
}
