import { supabase } from '../lib/supabaseClient'
import type { Venta, VentaPayload } from '../domain/entities'

/** Trae todas las ventas, ordenadas por fecha descendente. */
export async function getVentas(): Promise<Venta[]> {
  const { data, error } = await supabase
    .from('ventas')
    .select('id, fecha, total, cantidad_items, usuario_id, numero_orden')
    .order('fecha', { ascending: false })

  if (error) throw error
  return data ?? []
}

/** Crea una nueva venta. */
export async function crearVenta(venta: VentaPayload): Promise<Venta> {
  const { data, error } = await supabase
    .from('ventas')
    .insert(venta)
    .select()
    .single()

  if (error) throw error
  return data
}
