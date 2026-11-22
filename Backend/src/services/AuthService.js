import usuarioRepository from "../repositories/UsuarioRepository.js";
import { ConflictError, UnauthorizedError } from "../exceptions/AppError.js";
import { Messages } from "../enums/Messages.js";
import { Rol } from "../enums/Rol.js";
import { hashPassword, verifyPassword, generateToken } from "../utils/crypto.js";

// Sesiones en memoria: token -> id de usuario.
const sesiones = new Map();

const sanitizar = ({ contrasena, ...usuario }) => usuario;

class AuthService {
    register({ nombre, email, telefono, contrasena }) {
        if (usuarioRepository.findByEmail(email)) {
            throw new ConflictError(Messages.USER_EMAIL_DUPLICATED);
        }

        const usuario = usuarioRepository.create({
            nombre: nombre.trim(),
            email,
            telefono,
            contrasena: hashPassword(contrasena),
            rol: Rol.CLIENTE
        });

        return this.#crearSesion(usuario);
    }

    login({ email, contrasena }) {
        const usuario = usuarioRepository.findByEmail(email);

        if (!usuario || !verifyPassword(contrasena, usuario.contrasena)) {
            throw new UnauthorizedError(Messages.LOGIN_INVALID);
        }

        return this.#crearSesion(usuario);
    }

    logout(token) {
        sesiones.delete(token);
    }

    getUsuarioByToken(token) {
        const usuarioId = sesiones.get(token);

        if (!usuarioId) {
            return null;
        }

        return usuarioRepository.findById(usuarioId);
    }

    sanitizar(usuario) {
        return sanitizar(usuario);
    }

    #crearSesion(usuario) {
        const token = generateToken();
        sesiones.set(token, usuario.id);
        return { token, usuario: sanitizar(usuario) };
    }
}

export default new AuthService();
