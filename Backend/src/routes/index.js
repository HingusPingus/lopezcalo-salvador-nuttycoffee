import { Router } from "express";
import productoRoutes from "./productoRoutes.js";
import categoriaRoutes from "./categoriaRoutes.js";
import authRoutes from "./authRoutes.js";
import pedidoRoutes from "./pedidoRoutes.js";
import usuarioRoutes from "./usuarioRoutes.js";
import reporteRoutes from "./reporteRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/categorias", categoriaRoutes);
router.use("/productos", productoRoutes);
router.use("/pedidos", pedidoRoutes);
router.use("/usuarios", usuarioRoutes);
router.use("/reportes", reporteRoutes);

export default router;
