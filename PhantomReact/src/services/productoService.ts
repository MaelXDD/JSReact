import {
  getProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  actualizarStock,
} from '../repositories/productosRepository'
import type { Producto, ProductoPayload } from '../domain/entities'

export const productosService = {
  obtenerTodos: async (): Promise<Producto[]> => {
    const productos = await getProductos()
    return productos.filter(p => p.stock > 0)
  },

  obtenerParaAdmin: async (): Promise<Producto[]> => {
    return getProductos()
  },

  crear: async (payload: ProductoPayload): Promise<void> => {
    await crearProducto(payload)
  },

  actualizar: async (id: number, payload: ProductoPayload): Promise<void> => {
    await actualizarProducto(id, payload)
  },

  eliminar: async (id: number): Promise<void> => {
    await eliminarProducto(id)
  },

  actualizarStock: async (id: number, nuevoStock: number): Promise<void> => {
    await actualizarStock(id, nuevoStock)
  },
}
