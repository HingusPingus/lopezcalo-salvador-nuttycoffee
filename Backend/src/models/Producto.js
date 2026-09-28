class Producto {
    constructor(id, nombre, descripcion, precio, imagen, categoria, destacado = false, disponible = true, activo = true) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.imagen = imagen;
        this.categoria = categoria;
        this.destacado = destacado;
        this.disponible = disponible;
        this.activo = activo;
    }
}

export default Producto;
