import { Router } from "express";
import authController from "../controllers/AuthController.js";
import authenticate from "../middlewares/authenticate.js";
import { validateRegistro, validateLogin } from "../middlewares/validateUsuario.js";

const router = Router();

router.post("/registro", validateRegistro, authController.register);
router.post("/login", validateLogin, authController.login);
router.post("/logout", authenticate, authController.logout);
router.get("/me", authenticate, authController.me);

export default router;
