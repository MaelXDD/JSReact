import { crearVenta } from '../repositories/ventasRepository';
import { crearDetalleVentas } from '../repositories/detalleVentasRepository';

export const ventaService = {

    registrarCompra: async (datosVenta, items) => {
        try {
            const venta = await crearVenta(datosVenta);
            await crearDetalleVentas(items.map(i => ({ ...i, venta_id: venta.id })));
            return venta;

        } catch (error) {
            console.error("Error capturado en el servicio:", error);

            throw new Error("No pudimos procesar tu venta. Por favor, verifica tu conexión o intenta más tarde.");
        }
    }
};