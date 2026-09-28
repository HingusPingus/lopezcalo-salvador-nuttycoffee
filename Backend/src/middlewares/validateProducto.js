import { BadRequestError } from "../exceptions/AppError.js";
import { Messages } from "../enums/Messages.js";
import {
    isPlainObject,
    isNonEmptyString,
    isPositiveNumber,
    isPositiveInteger,
    isBoolean,
    isUndefined
} from "../utils/validators.js";

const NOMBRE_MIN = 3;
const NOMBRE_MAX = 60;
const DESCRIPCION_MAX = 255;

const validateProducto = (req, res, next) => {
    const body = req.body;

    if (!isPlainObject(body)) {
        throw new BadRequestError(Messages.INVALID_DATA);
    }

    const { nombre, descripcion, precio, imagen, categoriaId, destacado, disponible } = body;

    if (!isNonEmptyString(nombre)) {
        throw new BadRequestError(Messages.PRODUCT_NAME_REQUIRED);
    }

    const largoNombre = nombre.trim().length;
    if (largoNombre < NOMBRE_MIN || largoNombre > NOMBRE_MAX) {
        throw new BadRequestError(Messages.PRODUCT_NAME_LENGTH);
    }

    if (!isPositiveNumber(precio)) {
        throw new BadRequestError(Messages.PRODUCT_PRICE_INVALID);
    }

    if (!isPositiveInteger(categoriaId)) {
        throw new BadRequestError(Messages.PRODUCT_CATEGORY_REQUIRED);
    }

    if (!isUndefined(descripcion) && (typeof descripcion !== "string" || descripcion.length > DESCRIPCION_MAX)) {
        throw new BadRequestError(Messages.PRODUCT_DESCRIPTION_INVALID);
    }

    if (!isUndefined(imagen) && imagen !== null && !isNonEmptyString(imagen)) {
        throw new BadRequestError(Messages.PRODUCT_IMAGE_INVALID);
    }

    if (!isUndefined(destacado) && !isBoolean(destacado)) {
        throw new BadRequestError(Messages.PRODUCT_FEATURED_INVALID);
    }

    if (!isUndefined(disponible) && !isBoolean(disponible)) {
        throw new BadRequestError(Messages.PRODUCT_AVAILABLE_INVALID);
    }

    next();
};

export default validateProducto;
