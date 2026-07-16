import { useEffect, useMemo, useState } from 'react'
import { getProductos } from '../repositories/productosRepository'
import { getCategorias } from '../repositories/categoriasRepository'
import type { Categoria, Producto } from '../domain/entities'

export function useStoreCatalog() {
  const [products, setProducts] = useState<Producto[]>([])
  const [categories, setCategories] = useState<Categoria[]>([])
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState<'all' | number>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const [prods, cats] = await Promise.all([getProductos(), getCategorias()])
      setProducts(prods)
      setCategories(cats)
      setLoading(false)
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
