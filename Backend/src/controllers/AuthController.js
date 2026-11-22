import authService from "../services/AuthService.js";
import ApiResponse from "../responses/ApiResponse.js";
import { HttpStatus } from "../enums/HttpStatus.js";

class AuthController {
    register(req, res) {
        const sesion = authService.register(req.body);
        return ApiResponse.success(res, sesion, HttpStatus.CREATED);
    }

    login(req, res) {
        const sesion = authService.login(req.body);
        return ApiResponse.success(res, sesion);
    }

    logout(req, res) {
        authService.logout(req.token);
        return ApiResponse.success(res, null);
    }

    me(req, res) {
        return ApiResponse.success(res, authService.sanitizar(req.usuario));
    }
}

export default new AuthController();
