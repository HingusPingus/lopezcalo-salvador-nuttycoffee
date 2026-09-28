export const Messages = Object.freeze({
    // Productos
    PRODUCT_NOT_FOUND: "El producto no existe.",
    PRODUCT_DUPLICATED: "Ya existe un producto con ese nombre en la categoría.",
    PRODUCT_NAME_REQUIRED: "El nombre del producto es obligatorio.",
    PRODUCT_NAME_LENGTH: "El nombre del producto debe tener entre 3 y 60 caracteres.",
    PRODUCT_PRICE_INVALID: "El precio es obligatorio y debe ser un número mayor que cero.",
    PRODUCT_CATEGORY_REQUIRED: "La categoría es obligatoria y debe ser un ID válido.",
    PRODUCT_DESCRIPTION_INVALID: "La descripción debe ser un texto de hasta 255 caracteres.",
    PRODUCT_IMAGE_INVALID: "La imagen debe ser un texto con la URL de la imagen.",
    PRODUCT_FEATURED_INVALID: "El campo destacado debe ser verdadero o falso.",
    PRODUCT_AVAILABLE_INVALID: "El campo disponible debe ser verdadero o falso.",

    // Categorías
    CATEGORY_NOT_FOUND: "La categoría no existe.",

    // Generales
    INVALID_DATA: "Los datos enviados son inválidos.",
    INVALID_JSON: "El cuerpo de la solicitud no es un JSON válido.",
    INVALID_ID: "El ID debe ser un número entero positivo.",
    ROUTE_NOT_FOUND: "La ruta solicitada no existe.",
    INTERNAL_ERROR: "Ocurrió un error inesperado. Intente nuevamente más tarde."
});
