export type Rol = 'ADMIN' | 'USER'

export interface Usuario {
  id: number
  nombre: string
  email: string
  rol: Rol
  dni?: string
  direccion?: string
  fecha_registro?: string
  numero_telefono?: string
}

export interface Categoria {
  id: number
  nombre: string
  descripcion?: string
}

export interface Etiqueta {
  id: number
  nombre: string
}

export interface Producto {
  id: number
  nombre: string
  descripcion?: string
  precio: number
  stock: number
  marca?: string
  imagen_url?: string
  categoria_id: number
  categorias?: Pick<Categoria, 'nombre'>
}

export type ProductoPayload = Partial<Omit<Producto, 'id' | 'categorias'>>

export interface ProductoEtiqueta {
  producto_id: number
  etiqueta_id: number
}

export interface Venta {
  id: number
  fecha: string
  total: number
  cantidad_items: number
  usuario_id: number
  numero_orden: string
}

export type VentaPayload = Omit<Venta, 'id'>

export interface DetalleVenta {
  id: number
  venta_id: number
  producto_id: number
  cantidad: number
  precio_unitario: number
  subtotal: number
}

export type DetalleVentaPayload = Omit<DetalleVenta, 'id'>

export interface CartItem extends Producto {
  qty: number
}
