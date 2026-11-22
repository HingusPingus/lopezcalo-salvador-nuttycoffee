import Pedido from "../models/Pedido.js";
import DetallePedido from "../models/DetallePedido.js";
import { EstadoPedido } from "../enums/EstadoPedido.js";
import { createIdGenerator } from "../utils/idGenerator.js";

const ESTADOS_FINALES = [
    EstadoPedido.ENTREGADO,
    EstadoPedido.CANCELADO,
    EstadoPedido.RECHAZADO,
    EstadoPedido.NO_RETIRADO
];

const pedidos = [];
const nextPedidoId = createIdGenerator();
const nextDetalleId = createIdGenerator();

class PedidoRepository {
    findAll() {
        return [...pedidos];
    }

    findById(id) {
        return pedidos.find((pedido) => pedido.id === id) ?? null;
    }

    findByClienteId(clienteId) {
        return pedidos.filter((pedido) => pedido.cliente.id === clienteId);
    }

    countActivosByCliente(clienteId) {
        return pedidos.filter(
            (pedido) => pedido.cliente.id === clienteId && !ESTADOS_FINALES.includes(pedido.estado)
        ).length;
    }

    countNoRetiradosByCliente(clienteId) {
        return pedidos.filter(
            (pedido) => pedido.cliente.id === clienteId && pedido.estado === EstadoPedido.NO_RETIRADO
        ).length;
    }

    existsByProductoId(productoId) {
        return pedidos.some((pedido) =>
            pedido.detalles.some((detalle) => detalle.producto.id === productoId)
        );
    }

    create({ cliente, horarioRetiro, observaciones, items }) {
        const pedido = new Pedido(nextPedidoId(), cliente, horarioRetiro, observaciones);

        pedido.detalles = items.map(({ producto, cantidad, observaciones: obs }) =>
            new DetallePedido(
                nextDetalleId(),
                { id: producto.id, nombre: producto.nombre, imagen: producto.imagen },
                cantidad,
                producto.precio,
                obs
            )
        );

        pedido.total = pedido.detalles.reduce(
            (total, detalle) => total + detalle.precioUnitario * detalle.cantidad,
            0
        );

        pedidos.push(pedido);
        return pedido;
    }
}

export { ESTADOS_FINALES };
export default new PedidoRepository();
