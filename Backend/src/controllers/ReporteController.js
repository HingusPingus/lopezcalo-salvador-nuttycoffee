import reporteService from "../services/ReporteService.js";
import ApiResponse from "../responses/ApiResponse.js";

class ReporteController {
    getVentas(req, res) {
        return ApiResponse.success(res, reporteService.getVentas());
    }
}

export default new ReporteController();
