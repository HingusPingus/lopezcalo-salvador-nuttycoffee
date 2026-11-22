import { ForbiddenError } from "../exceptions/AppError.js";
import { Messages } from "../enums/Messages.js";

// Restringe la ruta a los roles indicados. Debe usarse después de authenticate.
const authorize = (...roles) => (req, res, next) => {
    if (!roles.includes(req.usuario.rol)) {
        throw new ForbiddenError(Messages.FORBIDDEN);
    }

    next();
};

export default authorize;
