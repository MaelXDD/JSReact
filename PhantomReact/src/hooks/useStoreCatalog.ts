import { useEffect, useMemo, useState } from 'react'
import { productosService } from '../services/productoService'
import { categoriasService } from '../services/categoriaService'
import type { Categoria, Producto } from '../domain/entities'

function isSupabaseError(err: unknown): err is { message: string } {
  return typeof err === 'object' && err !== null && 'message' in err
}

export function useStoreCatalog() {
  const [products, setProducts] = useState<Producto[]>([])
  const [categories, setCategories] = useState<Categoria[]>([])
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState<'all' | number>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const [prods, cats] = await Promise.all([
          productosService.obtenerParaAdmin(),
          categoriasService.obtenerCategorias(),
        ])
        setProducts(prods)
        setCategories(cats)
      } catch (err) {
        alert('Error al cargar el catálogo: ' + (isSupabaseError(err) ? err.message : 'error desconocido'))
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const displayed = useMemo(() => {
    return products.filter(p => {
      const matchSearch = p.nombre.toLowerCase().includes(search.toLowerCase())
      const matchCat = catFilter === 'all' || p.categoria_id === catFilter
      return matchSearch && matchCat
    })
  }, [products, search, catFilter])

  return { products, categories, search, setSearch, catFilter, setCatFilter, loading, displayed }
}