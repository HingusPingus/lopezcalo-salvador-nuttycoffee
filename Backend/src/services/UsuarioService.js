import usuarioRepository from "../repositories/UsuarioRepository.js";
import authService from "./AuthService.js";
import { NotFoundError } from "../exceptions/AppError.js";
import { Messages } from "../enums/Messages.js";

class UsuarioService {
    getAll() {
        return usuarioRepository.findAll().map((usuario) => authService.sanitizar(usuario));
    }

    setBloqueado(id, bloqueado) {
        const usuario = usuarioRepository.findById(id);

        if (!usuario) {
            throw new NotFoundError(Messages.USER_NOT_FOUND);
        }

        usuario.bloqueado = bloqueado;
        return authService.sanitizar(usuario);
    }
}

export default new UsuarioService();
