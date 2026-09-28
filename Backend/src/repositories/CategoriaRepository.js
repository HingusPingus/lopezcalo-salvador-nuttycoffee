import Categoria from "../models/Categoria.js";
import { createIdGenerator } from "../utils/idGenerator.js";

const categorias = [];
const nextId = createIdGenerator();

class CategoriaRepository {
    findAll() {
        return [...categorias];
    }

    findById(id) {
        return categorias.find((categoria) => categoria.id === id) ?? null;
    }

    create({ nombre, orden }) {
        const categoria = new Categoria(nextId(), nombre, orden);
        categorias.push(categoria);
        return categoria;
    }
}

const categoriaRepository = new CategoriaRepository();

// Datos iniciales
["Café", "Pastelería", "Yogures", "Sándwiches", "Ensaladas"]
    .forEach((nombre, index) => categoriaRepository.create({ nombre, orden: index + 1 }));

export default categoriaRepository;
