import { getCategorias } from '../repositories/categoriasRepository'
import type { Categoria } from '../domain/entities'

export const categoriasService = {
  obtenerCategorias: async (): Promise<Categoria[]> => {
    const categorias = await getCategorias()
    return categorias.map(c => ({ ...c, nombre: c.nombre.toUpperCase() }))
  },
}
