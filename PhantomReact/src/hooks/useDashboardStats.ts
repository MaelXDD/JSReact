import { useMemo } from 'react'
import type { Producto } from '../domain/entities'

/** Umbral bajo el cual un producto se considera con stock bajo. */
export const STOCK_BAJO_UMBRAL = 5

/** Cantidad de productos a mostrar en la sección de destacados. */
const CANTIDAD_DESTACADOS = 4

interface DashboardStats {
  stockBajo: Producto[]
  destacados: Producto[]
}

/**
 * Deriva las métricas del dashboard de admin a partir del catálogo ya cargado:
 * - stockBajo: productos con stock > 0 y <= STOCK_BAJO_UMBRAL, ordenados de menor a mayor stock.
 * - destacados: los productos de mayor precio (catálogo "premium"), excluyendo los sin stock.
 */
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
