// src/repositories/detalleVentasRepository.js
// ─────────────────────────────────────────────────────────
// Encapsula el acceso a la tabla "detalle_ventas" en Supabase.
// ─────────────────────────────────────────────────────────
import { supabase } from '../lib/supabaseClient'

/**
 * Trae el detalle de una venta específica, con datos del producto.
 * @param {number} ventaId
 * @returns {Promise<import('../domain/entities').DetalleVenta[]>}
 */
export async function getDetalleByVenta(ventaId) {
    const { data, error } = await supabase
        .from('detalle_ventas')
        .select(`
      id, venta_id, producto_id, cantidad, precio_unitario, subtotal,
      productos ( nombre, imagen_url )
    `)
        .eq('venta_id', ventaId)

    if (error) throw error
    return data ?? []
}

/**
 * Inserta varias líneas de detalle de una venta a la vez.
 * @param {Partial<import('../domain/entities').DetalleVenta>[]} detalles
 */
export async function crearDetalleVentas(detalles) {
    const { error } = await supabase
        .from('detalle_ventas')
        .insert(detalles)

    if (error) throw error
}