import { supabase } from '../lib/supabaseClient'

/**
 * Trae todas las ventas, ordenadas por fecha descendente.
 * @returns {Promise<import('../domain/entities').Venta[]>}
 */
export async function getVentas() {
    const { data, error } = await supabase
        .from('ventas')
        .select('id, fecha, total, cantidad_items, usuario_id, numero_orden')
        .order('fecha', { ascending: false })

    if (error) throw error
    return data ?? []
}

/**
 * Crea una nueva venta.
 * @param {Partial<import('../domain/entities').Venta>} venta
 * @returns {Promise<import('../domain/entities').Venta>}
 */
export async function crearVenta(venta) {
    const { data, error } = await supabase
        .from('ventas')
        .insert(venta)
        .select()
        .single()

    if (error) throw error
    return data
}