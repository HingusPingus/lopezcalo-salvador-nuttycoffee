import authService from "../services/AuthService.js";
import { UnauthorizedError } from "../exceptions/AppError.js";
import { Messages } from "../enums/Messages.js";

// Extrae el token Bearer y carga el usuario autenticado en req.usuario.
const authenticate = (req, res, next) => {
    const header = req.headers.authorization ?? "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    const usuario = token ? authService.getUsuarioByToken(token) : null;

    if (!usuario) {
        throw new UnauthorizedError(Messages.LOGIN_REQUIRED);
    }

    req.usuario = usuario;
    req.token = token;
    next();
};

export default authenticate;
