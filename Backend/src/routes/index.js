import { Router } from "express";
import productoRoutes from "./productoRoutes.js";

import categoriaRoutes from "./categoriaRoutes.js";

const router = Router();

router.use("/categorias", categoriaRoutes);
router.use("/productos", productoRoutes);

export default router;
