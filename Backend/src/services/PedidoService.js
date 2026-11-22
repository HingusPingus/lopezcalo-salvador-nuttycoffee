import pedidoRepository, { ESTADOS_FINALES } from "../repositories/PedidoRepository.js";
import productoRepository from "../repositories/ProductoRepository.js";
import { EstadoPedido } from "../enums/EstadoPedido.js";
import { Rol } from "../enums/Rol.js";
import { Messages } from "../enums/Messages.js";
import { BadRequestError, NotFoundError, ConflictError, ForbiddenError } from "../exceptions/AppError.js";
import {
    HORA_APERTURA,
    HORA_CIERRE,
    MINUTOS_ANTICIPACION,
    MAX_PEDIDOS_ACTIVOS,
    MAX_NO_RETIRADOS,
    MAX_CANTIDAD_POR_PRODUCTO
} from "../config/negocio.js";
import usuarioRepository from "../repositories/UsuarioRepository.js";

// Máquina de estados del pedido: transiciones permitidas desde cada estado.
const TRANSICIONES = Object.freeze({
    [EstadoPedido.PENDIENTE]: [EstadoPedido.CONFIRMADO, EstadoPedido.RECHAZADO, EstadoPedido.CANCELADO],
    [EstadoPedido.CONFIRMADO]: [EstadoPedido.EN_PREPARACION, EstadoPedido.CANCELADO],
    [EstadoPedido.EN_PREPARACION]: [EstadoPedido.LISTO_PARA_RETIRAR],
    [EstadoPedido.LISTO_PARA_RETIRAR]: [EstadoPedido.ENTREGADO, EstadoPedido.NO_RETIRADO]
});

const ESTADOS_DE_CLIENTE = [EstadoPedido.CANCELADO];

class PedidoService {
    getAll() {
        return this.#ordenarPorRetiro(pedidoRepository.findAll());
    }

    getByCliente(clienteId) {
        return this.#ordenarPorRetiro(pedidoRepository.findByClienteId(clienteId)).reverse();
    }

    getById(id) {
        const pedido = pedidoRepository.findById(id);

        if (!pedido) {
            throw new NotFoundError(Messages.ORDER_NOT_FOUND);
        }

        return pedido;
    }

    create(cliente, { horarioRetiro, observaciones, items }) {
        if (cliente.bloqueado) {
            throw new ForbiddenError(Messages.ORDER_USER_BLOCKED);
        }

        if (pedidoRepository.countActivosByCliente(cliente.id) >= MAX_PEDIDOS_ACTIVOS) {
            throw new ConflictError(Messages.ORDER_LIMIT_REACHED);
        }

        const retiro = this.#validarHorarioRetiro(horarioRetiro);
        const itemsValidados = items.map((item) => this.#validarItem(item));

        return pedidoRepository.create({
            cliente: { id: cliente.id, nombre: cliente.nombre, email: cliente.email, telefono: cliente.telefono },
            horarioRetiro: retiro,
            observaciones: observaciones?.trim() ?? "",
            items: itemsValidados
        });
    }

    cambiarEstado(usuario, pedidoId, nuevoEstado, motivoRechazo) {
        const pedido = this.getById(pedidoId);

        if (!Object.values(EstadoPedido).includes(nuevoEstado)) {
            throw new BadRequestError(Messages.ORDER_STATUS_INVALID);
        }

        this.#validarPermisoDeCambio(usuario, pedido, nuevoEstado);

        const permitidas = TRANSICIONES[pedido.estado] ?? [];
        if (!permitidas.includes(nuevoEstado)) {
            throw new ConflictError(
                Messages.ORDER_INVALID_TRANSITION
                    .replace("{desde}", pedido.estado)
                    .replace("{hacia}", nuevoEstado)
            );
        }

        if (nuevoEstado === EstadoPedido.RECHAZADO) {
            if (!motivoRechazo || !motivoRechazo.trim()) {
                throw new BadRequestError(Messages.ORDER_REJECT_REASON_REQUIRED);
            }
            pedido.motivoRechazo = motivoRechazo.trim();
        }

        pedido.estado = nuevoEstado;

        if (nuevoEstado === EstadoPedido.NO_RETIRADO) {
            this.#bloquearSiCorresponde(pedido.cliente.id);
        }

        return pedido;
    }

    // Reglas de permisos: el cliente solo cancela sus propios pedidos;
    // el resto de los estados los maneja el personal del local.
    #validarPermisoDeCliente(usuario, pedido) {
        if (pedido.cliente.id !== usuario.id) {
            throw new ForbiddenError(Messages.ORDER_NOT_OWNER);
        }
    }

    #validarPermisoDeCambio(usuario, pedido, nuevoEstado) {
        if (usuario.rol === Rol.CLIENTE) {
            this.#validarPermisoDeCliente(usuario, pedido);

            if (!ESTADOS_DE_CLIENTE.includes(nuevoEstado)) {
                throw new ForbiddenError(Messages.FORBIDDEN);
            }

            if (![EstadoPedido.PENDIENTE, EstadoPedido.CONFIRMADO].includes(pedido.estado)) {
                throw new ConflictError(Messages.ORDER_CANCEL_NOT_ALLOWED);
            }
        }
    }

    #bloquearSiCorresponde(clienteId) {
        if (pedidoRepository.countNoRetiradosByCliente(clienteId) >= MAX_NO_RETIRADOS) {
            const cliente = usuarioRepository.findById(clienteId);
            if (cliente) {
                cliente.bloqueado = true;
            }
        }
    }

    #validarHorarioRetiro(horarioRetiro) {
        const [hora, minutos] = horarioRetiro.split(":").map(Number);
        const retiro = new Date();
        retiro.setHours(hora, minutos, 0, 0);

        const ultimoRetiro = new Date();
        ultimoRetiro.setHours(HORA_CIERRE, -MINUTOS_ANTICIPACION, 0, 0);

        const apertura = new Date();
        apertura.setHours(HORA_APERTURA, 0, 0, 0);

        if (retiro < apertura || retiro > ultimoRetiro) {
            throw new BadRequestError(Messages.ORDER_PICKUP_OUT_OF_HOURS);
        }

        const minimo = new Date(Date.now() + MINUTOS_ANTICIPACION * 60 * 1000);
        if (retiro < minimo) {
            throw new BadRequestError(Messages.ORDER_PICKUP_TOO_SOON);
        }

        return retiro;
    }

    #validarItem({ productoId, cantidad, observaciones }) {
        const producto = productoRepository.findById(productoId);

        if (!producto) {
            throw new NotFoundError(Messages.PRODUCT_NOT_FOUND);
        }

        if (!producto.disponible || !producto.activo) {
            throw new ConflictError(
                Messages.ORDER_PRODUCT_UNAVAILABLE.replace("{nombre}", producto.nombre)
            );
        }

        if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > MAX_CANTIDAD_POR_PRODUCTO) {
            throw new BadRequestError(Messages.ORDER_ITEM_INVALID);
        }

        return { producto, cantidad, observaciones: observaciones?.trim() ?? "" };
    }

    #ordenarPorRetiro(lista) {
        return lista.sort((a, b) => new Date(a.horarioRetiro) - new Date(b.horarioRetiro));
    }
}

export { ESTADOS_FINALES };
export default new PedidoService();
