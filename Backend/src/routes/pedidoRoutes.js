import { Router } from "express";
import pedidoController from "../controllers/PedidoController.js";
import authenticate from "../middlewares/authenticate.js";
import authorize from "../middlewares/authorize.js";
import validateId from "../middlewares/validateId.js";
import validatePedido from "../middlewares/validatePedido.js";
import { Rol } from "../enums/Rol.js";

const router = Router();

router.use(authenticate);

router.get("/", authorize(Rol.EMPLEADO, Rol.ADMINISTRADOR), pedidoController.getAll);
router.get("/mios", authorize(Rol.CLIENTE), pedidoController.getMios);
router.post("/", authorize(Rol.CLIENTE), validatePedido, pedidoController.create);
router.patch("/:id/estado", validateId, pedidoController.cambiarEstado);

export default router;
