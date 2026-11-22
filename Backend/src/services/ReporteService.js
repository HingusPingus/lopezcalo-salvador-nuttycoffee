import pedidoRepository from "../repositories/PedidoRepository.js";
import { EstadoPedido } from "../enums/EstadoPedido.js";

const clave = (fecha) => {
    const dia = new Date(fecha);
    const mes = String(dia.getMonth() + 1).padStart(2, "0");
    return `${dia.getFullYear()}-${mes}-${String(dia.getDate()).padStart(2, "0")}`;
};

class ReporteService {
    // Ventas por día (pedidos entregados) y ranking de productos más pedidos.
    getVentas() {
        const entregados = pedidoRepository
            .findAll()
            .filter((pedido) => pedido.estado === EstadoPedido.ENTREGADO);

        const porDia = new Map();
        const porProducto = new Map();

        for (const pedido of entregados) {
            const dia = clave(pedido.fechaCreacion);
            const acumulado = porDia.get(dia) ?? { fecha: dia, cantidadPedidos: 0, totalVendido: 0 };
            acumulado.cantidadPedidos += 1;
            acumulado.totalVendido += pedido.total;
            porDia.set(dia, acumulado);

            for (const detalle of pedido.detalles) {
                const prod = porProducto.get(detalle.producto.id)
                    ?? { id: detalle.producto.id, nombre: detalle.producto.nombre, unidades: 0, total: 0 };
                prod.unidades += detalle.cantidad;
                prod.total += detalle.cantidad * detalle.precioUnitario;
                porProducto.set(detalle.producto.id, prod);
            }
        }

        return {
            ventasPorDia: [...porDia.values()].sort((a, b) => b.fecha.localeCompare(a.fecha)),
            productosMasPedidos: [...porProducto.values()].sort((a, b) => b.unidades - a.unidades)
        };
    }
}

export default new ReporteService();
