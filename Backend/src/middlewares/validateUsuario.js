import { BadRequestError } from "../exceptions/AppError.js";
import { Messages } from "../enums/Messages.js";
import { isPlainObject, isNonEmptyString } from "../utils/validators.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TELEFONO_REGEX = /^\d{8,15}$/;
const CONTRASENA_REGEX = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;

export const validateRegistro = (req, res, next) => {
    const body = req.body;

    if (!isPlainObject(body)) {
        throw new BadRequestError(Messages.INVALID_DATA);
    }

    const { nombre, email, telefono, contrasena } = body;

    if (!isNonEmptyString(nombre)) {
        throw new BadRequestError(Messages.USER_NAME_REQUIRED);
    }

    if (!isNonEmptyString(email) || !EMAIL_REGEX.test(email.trim())) {
        throw new BadRequestError(Messages.USER_EMAIL_INVALID);
    }

    if (!isNonEmptyString(telefono) || !TELEFONO_REGEX.test(telefono.trim())) {
        throw new BadRequestError(Messages.USER_PHONE_INVALID);
    }

    if (typeof contrasena !== "string" || !CONTRASENA_REGEX.test(contrasena)) {
        throw new BadRequestError(Messages.USER_PASSWORD_INVALID);
    }

    next();
};

export const validateLogin = (req, res, next) => {
    const body = req.body;

    if (!isPlainObject(body) || !isNonEmptyString(body.email) || !isNonEmptyString(body.contrasena)) {
        throw new BadRequestError(Messages.LOGIN_INVALID);
    }

    next();
};
