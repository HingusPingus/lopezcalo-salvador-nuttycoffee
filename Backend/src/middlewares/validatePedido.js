import { BadRequestError } from "../exceptions/AppError.js";
import { Messages } from "../enums/Messages.js";
import { isPlainObject, isPositiveInteger, isUndefined } from "../utils/validators.js";
import { OBSERVACIONES_MAX } from "../config/negocio.js";

const HORARIO_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

const observacionesValidas = (valor) =>
    isUndefined(valor) || (typeof valor === "string" && valor.length <= OBSERVACIONES_MAX);

const validatePedido = (req, res, next) => {
    const body = req.body;

    if (!isPlainObject(body)) {
        throw new BadRequestError(Messages.INVALID_DATA);
    }

    const { horarioRetiro, observaciones, items } = body;

    if (typeof horarioRetiro !== "string" || !HORARIO_REGEX.test(horarioRetiro)) {
        throw new BadRequestError(Messages.ORDER_PICKUP_INVALID);
    }

    if (!observacionesValidas(observaciones)) {
        throw new BadRequestError(Messages.ORDER_OBSERVATIONS_INVALID);
    }

    if (!Array.isArray(items) || items.length === 0) {
        throw new BadRequestError(Messages.ORDER_ITEMS_REQUIRED);
    }

    for (const item of items) {
        if (!isPlainObject(item) || !isPositiveInteger(item.productoId) || !isPositiveInteger(item.cantidad)) {
            throw new BadRequestError(Messages.ORDER_ITEM_INVALID);
        }

        if (!observacionesValidas(item.observaciones)) {
            throw new BadRequestError(Messages.ORDER_OBSERVATIONS_INVALID);
        }
    }

    next();
};

export default validatePedido;
