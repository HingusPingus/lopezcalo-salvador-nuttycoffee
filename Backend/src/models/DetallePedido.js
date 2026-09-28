class DetallePedido {
    constructor(id, producto, cantidad, precioUnitario, observaciones = "") {
        this.id = id;
        this.producto = producto;
        this.cantidad = cantidad;
        this.precioUnitario = precioUnitario;
        this.observaciones = observaciones;
    }
}

export default DetallePedido;
