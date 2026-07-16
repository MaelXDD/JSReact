import { getProductos } from '../repositories/productosRepository'
import type { Producto } from '../domain/entities'

export const productosService = {
  obtenerTodos: async (): Promise<Producto[]> => {
    const productos = await getProductos()
    return productos.filter(p => p.stock > 0)
  },
}
