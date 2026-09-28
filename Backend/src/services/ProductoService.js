import productoRepository from "../repositories/ProductoRepository.js";
import categoriaRepository from "../repositories/CategoriaRepository.js";
import { NotFoundError, ConflictError } from "../exceptions/AppError.js";
import { Messages } from "../enums/Messages.js";

class ProductoService {
    getAll() {
        return productoRepository.findAll();
    }

    getById(id) {
        const producto = productoRepository.findById(id);

        if (!producto) {
            throw new NotFoundError(Messages.PRODUCT_NOT_FOUND);
        }

        return producto;
    }

    create(datos) {
        const categoria = this.#getCategoria(datos.categoriaId);
        this.#validarNombreDisponible(datos.nombre, categoria.id);

        return productoRepository.create(this.#armarProducto(datos, categoria));
    }

    update(id, datos) {
        this.getById(id);

        const categoria = this.#getCategoria(datos.categoriaId);
        this.#validarNombreDisponible(datos.nombre, categoria.id, id);

        return productoRepository.update(id, this.#armarProducto(datos, categoria));
    }

    delete(id) {
        this.getById(id);
        return productoRepository.delete(id);
    }

    #getCategoria(categoriaId) {
        const categoria = categoriaRepository.findById(categoriaId);

        if (!categoria) {
            throw new NotFoundError(Messages.CATEGORY_NOT_FOUND);
        }

        return categoria;
    }

    // Regla de negocio: no puede haber dos productos con el mismo nombre en una categoría.
    #validarNombreDisponible(nombre, categoriaId, idExcluido = null) {
        const existente = productoRepository.findByNombreYCategoria(nombre, categoriaId);

        if (existente && existente.id !== idExcluido) {
            throw new ConflictError(Messages.PRODUCT_DUPLICATED);
        }
    }

    #armarProducto(datos, categoria) {
        return {
            nombre: datos.nombre.trim(),
            descripcion: datos.descripcion?.trim() ?? "",
            precio: datos.precio,
            imagen: datos.imagen ?? null,
            categoria,
            destacado: datos.destacado ?? false,
            disponible: datos.disponible ?? true
        };
    }
}

export default new ProductoService();
