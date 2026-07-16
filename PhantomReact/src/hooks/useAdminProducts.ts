import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { productosService } from '../services/productoService'
import { categoriasService } from '../services/categoriaService'
import type { Categoria, Producto } from '../domain/entities'

interface ProductFormState {
  nombre: string
  descripcion: string
  precio: string
  stock: string
  marca: string
  imagen_url: string
  categoria_id: string
}

const EMPTY_FORM: ProductFormState = {
  nombre: '', descripcion: '', precio: '', stock: '',
  marca: '', imagen_url: '', categoria_id: '',
}

/** Estado del modal: `false` cerrado, `'create'` creando, o el producto en edición. */
type ModalState = false | 'create' | Producto

function isSupabaseError(err: unknown): err is { message: string } {
  return typeof err === 'object' && err !== null && 'message' in err
}

export function useAdminProducts() {
  const [products, setProducts] = useState<Producto[]>([])
  const [categories, setCategories] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<ModalState>(false)
  const [form, setForm] = useState<ProductFormState>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  async function loadProducts(): Promise<void> {
    setLoading(true)
    const data = await productosService.obtenerParaAdmin()
    setProducts(data)
    setLoading(false)
  }

  useEffect(() => {
    async function init() {
      await loadProducts()
      const cats = await categoriasService.obtenerCategorias()
      setCategories(cats)
    }
    init()
  }, [])

  function openCreate(): void {
    setForm(EMPTY_FORM)
    setModal('create')
  }

  function openEdit(product: Producto): void {
    setForm({
      nombre: product.nombre ?? '',
      descripcion: product.descripcion ?? '',
      precio: String(product.precio ?? ''),
      stock: String(product.stock ?? ''),
      marca: product.marca ?? '',
      imagen_url: product.imagen_url ?? '',
      categoria_id: product.categoria_id ? String(product.categoria_id) : '',
    })
    setModal(product)
  }

  function closeModal(): void {
    setModal(false)
  }

  async function handleSave(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        nombre: form.nombre,
        descripcion: form.descripcion,
        marca: form.marca,
        imagen_url: form.imagen_url,
        precio: parseFloat(form.precio),
        stock: parseInt(form.stock, 10),
        categoria_id: form.categoria_id ? parseInt(form.categoria_id, 10) : undefined,
      }

      if (modal === 'create') {
        await productosService.crear(payload)
      } else if (modal) {
        await productosService.actualizar(modal.id, payload)
      }

      setModal(false)
      await loadProducts()
    } catch (err) {
      alert('Error al guardar: ' + (isSupabaseError(err) ? err.message : 'error desconocido'))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: number): Promise<void> {
    if (!window.confirm('¿Eliminar este producto?')) return
    try {
      await productosService.eliminar(id)
      await loadProducts()
    } catch (err) {
      alert('Error: ' + (isSupabaseError(err) ? err.message : 'error desconocido'))
    }
  }

  function onChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  return {
    products, categories, loading, modal, form, saving,
    openCreate, openEdit, closeModal, handleSave, handleDelete, onChange,
  }
}
