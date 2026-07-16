import { supabase } from '../lib/supabaseClient'
import type { Producto, ProductoPayload } from '../domain/entities'

/** Trae todos los productos con su categoría asociada (JOIN). */
export async function getProductos(): Promise<Producto[]> {
  const { data, error } = await supabase
    .from('productos')
    .select(`
      id, nombre, descripcion, precio, stock, marca, imagen_url, categoria_id,
      categorias ( nombre )
    `)
    .order('nombre')

  if (error) throw error
  return (data as unknown as Producto[]) ?? []
}

/** Crea un producto nuevo. */
export async function crearProducto(payload: ProductoPayload): Promise<void> {
  const { error } = await supabase.from('productos').insert(payload)
  if (error) throw error
}

/** Actualiza un producto existente. */
export async function actualizarProducto(id: number, payload: ProductoPayload): Promise<void> {
  const { error } = await supabase.from('productos').update(payload).eq('id', id)
  if (error) throw error
}

/** Elimina un producto por id. */
export async function eliminarProducto(id: number): Promise<void> {
  const { error } = await supabase.from('productos').delete().eq('id', id)
  if (error) throw error
}

/** Actualiza el stock de un producto. */
export async function actualizarStock(id: number, nuevoStock: number): Promise<void> {
  const { error } = await supabase
    .from('productos')
    .update({ stock: nuevoStock })
    .eq('id', id)
  if (error) throw error
}
