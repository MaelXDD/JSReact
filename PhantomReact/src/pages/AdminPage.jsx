import { useEffect, useState } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiLoader, FiX } from 'react-icons/fi'
import { getProductos, crearProducto, actualizarProducto, eliminarProducto } from '../repositories/productosRepository'
import { getCategorias } from '../repositories/categoriasRepository'
const EMPTY_FORM = {
  nombre: '', descripcion: '', precio: '', stock: '',
  marca: '', imagen_url: '', categoria_id: ''
}

export default function AdminPage() {
  const [products,   setProducts]   = useState([])
  const [categories, setCategories] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [modal,      setModal]      = useState(false)   // true = crear, 'obj' = editar
  const [form,       setForm]       = useState(EMPTY_FORM)
  const [saving,     setSaving]     = useState(false)

  // read
  async function loadProducts() {
    setLoading(true)
    const data = await getProductos()
    setProducts(data)
    setLoading(false)
  }

  useEffect(() => {
    async function init() {
      await loadProducts()
      const cats = await getCategorias()
      setCategories(cats)
    }
    init()
  }, [])

  // abrir el modal
  function openCreate() {
    setForm(EMPTY_FORM)
    setModal('create')
  }

  function openEdit(product) {
    setForm({
      nombre:       product.nombre       ?? '',
      descripcion:  product.descripcion  ?? '',
      precio:       product.precio       ?? '',
      stock:        product.stock        ?? '',
      marca:        product.marca        ?? '',
      imagen_url:   product.imagen_url   ?? '',
      categoria_id: product.categoria_id ?? '',
    })
    setModal(product)
  }

  // create / update
  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        ...form,
        precio:       parseFloat(form.precio),
        stock:        parseInt(form.stock),
        categoria_id: form.categoria_id ? parseInt(form.categoria_id) : null,
      }

      if (modal === 'create') {
        await crearProducto(payload)
      } else {
        await actualizarProducto(modal.id, payload)
      }

      setModal(false)
      await loadProducts()
    } catch (err) {
      alert('Error al guardar: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  // delete
async function handleDelete(id) {
  if (!window.confirm('¿Eliminar este producto?')) return
  try {
    await eliminarProducto(id)
    await loadProducts()
  } catch (err) {
    alert('Error: ' + err.message)
  }
}

  function onChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  // render
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Panel de administración</h1>
          <p className="text-gray-500 text-sm mt-1">{products.length} productos registrados</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <FiPlus /> Nuevo producto
        </button>
      </div>

      {/* Tabla */}
      {loading ? (
        <div className="flex items-center justify-center py-24 text-gray-400">
          <FiLoader className="animate-spin text-3xl mr-3" /> Cargando...
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['ID','Nombre','Marca','Categoría','Precio','Stock','Acciones'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-400 font-mono">#{p.id}</td>
                    <td className="px-4 py-3 font-medium text-gray-900 max-w-xs">
                      <div className="flex items-center gap-3">
                        {p.imagen_url && (
                          <img src={p.imagen_url} alt="" className="w-8 h-8 rounded object-cover shrink-0"
                            onError={e => { e.target.style.display='none' }} />
                        )}
                        <span className="truncate">{p.nombre}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{p.marca || '—'}</td>
                    <td className="px-4 py-3">
                      {p.categorias?.nombre
                        ? <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{p.categorias.nombre}</span>
                        : <span className="text-gray-300">—</span>
                      }
                    </td>
                    <td className="px-4 py-3 font-semibold text-primary-600">
                      S/ {Number(p.precio).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        p.stock === 0 ? 'bg-red-50 text-red-600' :
                        p.stock < 5  ? 'bg-yellow-50 text-yellow-600' :
                        'bg-green-50 text-green-600'
                      }`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(p)}
                          className="flex items-center gap-1 text-xs btn-secondary px-2 py-1"
                        >
                          <FiEdit2 /> Editar
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="flex items-center gap-1 text-xs btn-danger px-2 py-1"
                        >
                          <FiTrash2 /> Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Crear / Editar */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">
                {modal === 'create' ? 'Nuevo producto' : `Editar: ${modal.nombre}`}
              </h2>
              <button onClick={() => setModal(false)} className="text-gray-400 hover:text-gray-700">
                <FiX className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                <input name="nombre" required className="input-field" value={form.nombre} onChange={onChange} />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea name="descripcion" rows={3} className="input-field resize-none" value={form.descripcion} onChange={onChange} />
              </div>

              {/* Precio + Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Precio (S/) *</label>
                  <input name="precio" type="number" step="0.01" min="0" required className="input-field" value={form.precio} onChange={onChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                  <input name="stock" type="number" min="0" required className="input-field" value={form.stock} onChange={onChange} />
                </div>
              </div>

              {/* Marca + Categoría */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                  <input name="marca" className="input-field" value={form.marca} onChange={onChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                  <select name="categoria_id" className="input-field" value={form.categoria_id} onChange={onChange}>
                    <option value="">Sin categoría</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Imagen URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL de imagen</label>
                <input name="imagen_url" type="url" className="input-field" placeholder="https://..." value={form.imagen_url} onChange={onChange} />
              </div>

              {/* Acciones */}
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary flex-1">
                  {saving ? 'Guardando...' : modal === 'create' ? 'Crear producto' : 'Guardar cambios'}
                </button>
                <button type="button" onClick={() => setModal(false)} className="btn-secondary flex-1">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
