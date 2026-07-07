import { getProductos } from '../repositories/productosRepository';

export const productosService = {
    obtenerTodos: async () => {
        const productos = await getProductos();
        return productos.filter(p => p.stock > 0);
    }
};