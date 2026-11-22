import productoService from "../services/ProductoService.js";
import ApiResponse from "../responses/ApiResponse.js";
import { HttpStatus } from "../enums/HttpStatus.js";
import { BadRequestError } from "../exceptions/AppError.js";
import { Messages } from "../enums/Messages.js";

class ProductoController {
    getAll(req, res) {
        const productos = productoService.getAll();
        return ApiResponse.success(res, productos);
    }

    getById(req, res) {
        const producto = productoService.getById(Number(req.params.id));
        return ApiResponse.success(res, producto);
    }

    create(req, res) {
        const producto = productoService.create(req.body);
        return ApiResponse.success(res, producto, HttpStatus.CREATED);
    }

    update(req, res) {
        const producto = productoService.update(Number(req.params.id), req.body);
        return ApiResponse.success(res, producto);
    }

    delete(req, res) {
        const producto = productoService.delete(Number(req.params.id));
        return ApiResponse.success(res, producto);
    }

    cambiarDisponibilidad(req, res) {
        const { disponible } = req.body ?? {};

        if (typeof disponible !== "boolean") {
            throw new BadRequestError(Messages.PRODUCT_AVAILABLE_INVALID);
        }

        const producto = productoService.cambiarDisponibilidad(Number(req.params.id), disponible);
        return ApiResponse.success(res, producto);
    }
}

export default new ProductoController();
