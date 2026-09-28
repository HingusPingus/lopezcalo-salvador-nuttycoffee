import { EstadoPedido } from "../enums/EstadoPedido.js";

class Pedido {
    constructor(id, cliente, horarioRetiro, observaciones = "") {
        this.id = id;
        this.cliente = cliente;
        this.fechaCreacion = new Date();
        this.horarioRetiro = horarioRetiro;
        this.estado = EstadoPedido.PENDIENTE;
        this.detalles = [];
        this.total = 0;
        this.observaciones = observaciones;
        this.motivoRechazo = null;
    }
}

export default Pedido;
