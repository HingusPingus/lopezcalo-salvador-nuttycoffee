import { Router } from "express";
import reporteController from "../controllers/ReporteController.js";
import authenticate from "../middlewares/authenticate.js";
import authorize from "../middlewares/authorize.js";
import { Rol } from "../enums/Rol.js";

const router = Router();

router.use(authenticate, authorize(Rol.ADMINISTRADOR));

router.get("/ventas", reporteController.getVentas);

export default router;
