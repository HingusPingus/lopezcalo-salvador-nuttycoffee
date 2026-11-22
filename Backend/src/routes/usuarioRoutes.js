import { Router } from "express";
import usuarioController from "../controllers/UsuarioController.js";
import authenticate from "../middlewares/authenticate.js";
import authorize from "../middlewares/authorize.js";
import validateId from "../middlewares/validateId.js";
import { Rol } from "../enums/Rol.js";

const router = Router();

router.use(authenticate, authorize(Rol.ADMINISTRADOR));

router.get("/", usuarioController.getAll);
router.patch("/:id/bloqueo", validateId, usuarioController.setBloqueado);

export default router;
