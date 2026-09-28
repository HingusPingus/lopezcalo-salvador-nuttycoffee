import { BadRequestError } from "../exceptions/AppError.js";
import { Messages } from "../enums/Messages.js";
import { isPositiveInteger } from "../utils/validators.js";

const validateId = (req, res, next) => {
    const id = Number(req.params.id);

    if (!isPositiveInteger(id)) {
        throw new BadRequestError(Messages.INVALID_ID);
    }

    next();
};

export default validateId;
