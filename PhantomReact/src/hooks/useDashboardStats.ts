import { useMemo } from 'react'
import type { Producto } from '../domain/entities'

export const STOCK_BAJO_UMBRAL = 5

const CANTIDAD_DESTACADOS = 4

interface DashboardStats {
  stockBajo: Producto[]
  destacados: Producto[]
}

export function useDashboardStats(products: Producto[]): DashboardStats {
  return useMemo(() => {
    const conStock = products.filter(p => p.stock > 0)

    const stockBajo = conStock
      .filter(p => p.stock <= STOCK_BAJO_UMBRAL)
      .sort((a, b) => a.stock - b.stock)

    const destacados = [...conStock]
      .sort((a, b) => b.precio - a.precio)
      .slice(0, CANTIDAD_DESTACADOS)

    return { stockBajo, destacados }
  }, [products])
}
