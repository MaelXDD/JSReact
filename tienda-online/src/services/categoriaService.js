import { getCategorias } from '../repositories/categoriasRepository';

export const categoriasService = {
    obtenerCategorias: async () => {
        const categorias = await getCategorias();
        return categorias.map(c => ({ ...c, nombre: c.nombre.toUpperCase() }));
    }
};