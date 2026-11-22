import pedidoService from "../services/PedidoService.js";
import ApiResponse from "../responses/ApiResponse.js";
import { HttpStatus } from "../enums/HttpStatus.js";

class PedidoController {
    getAll(req, res) {
        return ApiResponse.success(res, pedidoService.getAll());
    }

    getMios(req, res) {
        return ApiResponse.success(res, pedidoService.getByCliente(req.usuario.id));
    }

    create(req, res) {
        const pedido = pedidoService.create(req.usuario, req.body);
        return ApiResponse.success(res, pedido, HttpStatus.CREATED);
    }

    cambiarEstado(req, res) {
        const pedido = pedidoService.cambiarEstado(
            req.usuario,
            Number(req.params.id),
            req.body?.estado,
            req.body?.motivoRechazo
        );
        return ApiResponse.success(res, pedido);
    }
}

export default new PedidoController();
