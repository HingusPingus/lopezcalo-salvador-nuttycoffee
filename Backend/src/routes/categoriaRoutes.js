import { Router } from "express";
import categoriaRepository from "../repositories/CategoriaRepository.js";
import ApiResponse from "../responses/ApiResponse.js";

const router = Router();

router.get("/", (req, res) => ApiResponse.success(res, categoriaRepository.findAll()));

export default router;
