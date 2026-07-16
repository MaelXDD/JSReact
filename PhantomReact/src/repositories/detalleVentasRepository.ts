import { supabase } from '../lib/supabaseClient'
import type { DetalleVenta, DetalleVentaPayload } from '../domain/entities'

/** Trae el detalle de una venta específica, con datos del producto. */
export async function getDetalleByVenta(ventaId: number): Promise<DetalleVenta[]> {
  const { data, error } = await supabase
    .from('detalle_ventas')
    .select(`
      id, venta_id, producto_id, cantidad, precio_unitario, subtotal,
      productos ( nombre, imagen_url )
    `)
    .eq('venta_id', ventaId)

  if (error) throw error
  return (data as unknown as DetalleVenta[]) ?? []
}

/** Inserta varias líneas de detalle de una venta a la vez. */
export async function crearDetalleVentas(detalles: DetalleVentaPayload[]): Promise<void> {
  const { error } = await supabase
    .from('detalle_ventas')
    .insert(detalles)

  if (error) throw error
}
