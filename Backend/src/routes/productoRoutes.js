import { Router } from "express";
import productoController from "../controllers/ProductoController.js";
import validateId from "../middlewares/validateId.js";
import validateProducto from "../middlewares/validateProducto.js";
import authenticate from "../middlewares/authenticate.js";
import authorize from "../middlewares/authorize.js";
import { Rol } from "../enums/Rol.js";

const router = Router();

// Lectura pública: cualquier visitante puede consultar el menú.
router.get("/", productoController.getAll);
router.get("/:id", validateId, productoController.getById);

// Solo el administrador puede crear, editar o eliminar productos.
router.post("/", authenticate, authorize(Rol.ADMINISTRADOR), validateProducto, productoController.create);
router.put("/:id", authenticate, authorize(Rol.ADMINISTRADOR), validateId, validateProducto, productoController.update);
router.delete("/:id", authenticate, authorize(Rol.ADMINISTRADOR), validateId, productoController.delete);

// Los empleados pueden marcar productos como agotados o disponibles.
router.patch(
    "/:id/disponibilidad",
    authenticate,
    authorize(Rol.EMPLEADO, Rol.ADMINISTRADOR),
    validateId,
    productoController.cambiarDisponibilidad
);

export default router;
