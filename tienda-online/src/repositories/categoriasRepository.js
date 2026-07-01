import { supabase } from '../lib/supabaseClient'

/**
 * @returns {Promise<import('../domain/entities').Categoria[]>}
 */
export async function getCategorias() {
    const { data, error } = await supabase
        .from('categorias')
        .select('id, nombre')
        .order('nombre')

    if (error) throw error
    return data ?? []
}