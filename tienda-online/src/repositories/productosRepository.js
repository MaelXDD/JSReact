import { supabase } from '../lib/supabaseClient'

/**
 * Trae todos los productos con su categoría asociada (JOIN).
 * @returns {Promise<import('../domain/entities').Producto[]>}
 */
export async function getProductos() {
    const { data, error } = await supabase
        .from('productos')
        .select(`
      id, nombre, descripcion, precio, stock, marca, imagen_url, categoria_id,
      categorias ( nombre )
    `)
        .order('nombre')

    if (error) throw error
    return data ?? []
}
/**
 * Crea un producto nuevo.
 * @param {Partial<import('../domain/entities').Producto>} payload
 */
export async function crearProducto(payload) {
    const { error } = await supabase.from('productos').insert(payload)
    if (error) throw error
}

/**
 * Actualiza un producto existente.
 * @param {number} id
 * @param {Partial<import('../domain/entities').Producto>} payload
 */
export async function actualizarProducto(id, payload) {
    const { error } = await supabase.from('productos').update(payload).eq('id', id)
    if (error) throw error
}

/**
 * Elimina un producto por id.
 * @param {number} id
 */
export async function eliminarProducto(id) {
    const { error } = await supabase.from('productos').delete().eq('id', id)
    if (error) throw error
}
/**
 * Actualiza el stock de un producto.
 * @param {number} id
 * @param {number} nuevoStock
 */
export async function actualizarStock(id, nuevoStock) {
    const { error } = await supabase
        .from('productos')
        .update({ stock: nuevoStock })
        .eq('id', id)
    if (error) throw error
}