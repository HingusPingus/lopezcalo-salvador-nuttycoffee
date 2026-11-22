import usuarioService from "../services/UsuarioService.js";
import ApiResponse from "../responses/ApiResponse.js";
import { BadRequestError } from "../exceptions/AppError.js";
import { Messages } from "../enums/Messages.js";
import { isBoolean } from "../utils/validators.js";

class UsuarioController {
    getAll(req, res) {
        return ApiResponse.success(res, usuarioService.getAll());
    }

    setBloqueado(req, res) {
        const { bloqueado } = req.body ?? {};

        if (!isBoolean(bloqueado)) {
            throw new BadRequestError(Messages.USER_BLOCKED_INVALID);
        }

        const usuario = usuarioService.setBloqueado(Number(req.params.id), bloqueado);
        return ApiResponse.success(res, usuario);
    }
}

export default new UsuarioController();
