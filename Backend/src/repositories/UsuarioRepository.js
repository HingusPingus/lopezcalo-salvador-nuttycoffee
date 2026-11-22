import Usuario from "../models/Usuario.js";
import { Rol } from "../enums/Rol.js";
import { createIdGenerator } from "../utils/idGenerator.js";
import { hashPassword } from "../utils/crypto.js";

const usuarios = [];
const nextId = createIdGenerator();

class UsuarioRepository {
    findAll() {
        return [...usuarios];
    }

    findById(id) {
        return usuarios.find((usuario) => usuario.id === id) ?? null;
    }

    findByEmail(email) {
        const normalizado = email.trim().toLowerCase();
        return usuarios.find((usuario) => usuario.email === normalizado) ?? null;
    }

    create({ nombre, email, telefono, contrasena, rol }) {
        const usuario = new Usuario(
            nextId(),
            nombre,
            email.trim().toLowerCase(),
            telefono,
            contrasena,
            rol
        );

        usuarios.push(usuario);
        return usuario;
    }
}

const usuarioRepository = new UsuarioRepository();

// Datos iniciales (contraseñas: Admin1234 / Empleado1 / Cliente123)
[
    { nombre: "Admin Nutty", email: "admin@nutty.com", telefono: "1155550100", contrasena: "Admin1234", rol: Rol.ADMINISTRADOR },
    { nombre: "Barista Nutty", email: "empleado@nutty.com", telefono: "1155550101", contrasena: "Empleado1", rol: Rol.EMPLEADO },
    { nombre: "Cliente Demo", email: "cliente@nutty.com", telefono: "1155550102", contrasena: "Cliente123", rol: Rol.CLIENTE }
].forEach(({ contrasena, ...datos }) =>
    usuarioRepository.create({ ...datos, contrasena: hashPassword(contrasena) })
);

export default usuarioRepository;
