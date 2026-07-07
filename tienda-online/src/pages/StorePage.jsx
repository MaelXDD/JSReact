import { useEffect, useState } from 'react'
import { FiSearch, FiLoader } from 'react-icons/fi'
import { getProductos } from '../repositories/productosRepository'
import { getCategorias } from '../repositories/categoriasRepository'
import ProductCard from '../components/client/ProductCard'

export default function StorePage() {
  /** @type {import('../domain/entities').Producto} */
  const productoEjemplo = {}
  const [products,   setProducts]   = useState([])
  const [categories, setCategories] = useState([])
  const [search,     setSearch]     = useState('')
  const [catFilter,  setCatFilter]  = useState('all')
  const [loading,    setLoading]    = useState(true)

  // Select con join
  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const [prods, cats] = await Promise.all([
        getProductos(),
        getCategorias(),
      ])
      setProducts(prods)
      setCategories(cats)
      setLoading(false)
    }
    loadData()
  }, [])

  // Filtrado local
  const filtered = products.filter(p => {
    const matchSearch = p.nombre.toLowerCase().includes(search.toLowerCase())
    const matchCat    = catFilter === 'all' || p.categoria_id === catFilter
    return matchSearch && matchCat
  })

  // Filtro por categoria_id desde los propios datos
  const displayedByCategory = catFilter === 'all'
    ? filtered
    : products.filter(p => {
        const matchSearch = p.nombre.toLowerCase().includes(search.toLowerCase())
        const catName = categories.find(c => c.id === catFilter)?.nombre
        const matchCat = p.categorias?.nombre === catName
        return matchSearch && matchCat
      })

  const displayed = catFilter === 'all' ? filtered : displayedByCategory

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Catálogo de productos</h1>
        <p className="text-gray-500 mt-1">Encuentra todo lo que necesitas</p>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar productos..."
            className="input-field pl-9"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="input-field sm:w-48"
          value={catFilter}
          onChange={e => setCatFilter(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
        >
          <option value="all">Todas las categorías</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-24 text-gray-400">
          <FiLoader className="animate-spin text-3xl mr-3" /> Cargando productos...
        </div>
      ) : displayed.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <p className="text-lg">No se encontraron productos.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayed.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
