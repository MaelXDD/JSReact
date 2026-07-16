import { crearVenta } from '../repositories/ventasRepository'
import { crearDetalleVentas } from '../repositories/detalleVentasRepository'
import type { DetalleVentaPayload, Venta, VentaPayload } from '../domain/entities'

type DetalleSinVenta = Omit<DetalleVentaPayload, 'venta_id'>

export const ventaService = {
  registrarCompra: async (datosVenta: VentaPayload, items: DetalleSinVenta[]): Promise<Venta> => {
    try {
      const venta = await crearVenta(datosVenta)
      await crearDetalleVentas(items.map(i => ({ ...i, venta_id: venta.id })))
      return venta
    } catch (error) {
      console.error('Error capturado en el servicio:', error)
      throw new Error('No pudimos procesar tu venta. Por favor, verifica tu conexión o intenta más tarde.')
    }
  },
}
