import Producto from "../models/Producto.js";
import categoriaRepository from "./CategoriaRepository.js";
import { createIdGenerator } from "../utils/idGenerator.js";

const productos = [];
const nextId = createIdGenerator();

class ProductoRepository {
    findAll() {
        return [...productos];
    }

    findById(id) {
        return productos.find((producto) => producto.id === id) ?? null;
    }

    findByNombreYCategoria(nombre, categoriaId) {
        const nombreNormalizado = nombre.trim().toLowerCase();

        return productos.find((producto) =>
            producto.nombre.toLowerCase() === nombreNormalizado &&
            producto.categoria.id === categoriaId
        ) ?? null;
    }

    create({ nombre, descripcion, precio, imagen, categoria, destacado, disponible }) {
        const producto = new Producto(
            nextId(),
            nombre,
            descripcion,
            precio,
            imagen,
            categoria,
            destacado,
            disponible
        );

        productos.push(producto);
        return producto;
    }

    update(id, datos) {
        const producto = this.findById(id);
        Object.assign(producto, datos);
        return producto;
    }

    delete(id) {
        const index = productos.findIndex((producto) => producto.id === id);
        const [eliminado] = productos.splice(index, 1);
        return eliminado;
    }
}

const productoRepository = new ProductoRepository();

// Datos iniciales
[
    { nombre: "Flat White", descripcion: "Doble ristretto con leche texturizada.", precio: 3800, categoriaId: 1, destacado: true },
    { nombre: "Medialuna de manteca", descripcion: "Medialuna artesanal horneada en el día.", precio: 1500, categoriaId: 2, destacado: false },
    { nombre: "Yogur con granola", descripcion: "Yogur natural con granola casera y frutos rojos.", precio: 4500, categoriaId: 3, destacado: true },
    { nombre: "Sándwich de jamón y queso", descripcion: "Pan de masa madre, jamón cocido y queso tybo.", precio: 6500, categoriaId: 4, destacado: false },
    { nombre: "Ensalada César", descripcion: "Lechuga, pollo grillado, croutons, parmesano y aderezo César.", precio: 7800, categoriaId: 5, destacado: true }
].forEach(({ categoriaId, ...datos }) => productoRepository.create({
    ...datos,
    imagen: null,
    categoria: categoriaRepository.findById(categoriaId),
    disponible: true
}));

export default productoRepository;
