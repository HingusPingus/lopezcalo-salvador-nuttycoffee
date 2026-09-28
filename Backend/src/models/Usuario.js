class Usuario {
    constructor(id, nombre, email, telefono, contrasena, rol, bloqueado = false, fechaRegistro = new Date()) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.telefono = telefono;
        this.contrasena = contrasena;
        this.rol = rol; // "CLIENTE" | "EMPLEADO" | "ADMINISTRADOR"
        this.bloqueado = bloqueado;
        this.fechaRegistro = fechaRegistro;
    }
}

export default Usuario;
