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

    // Usuarios y autenticación
    USER_NOT_FOUND: "El usuario no existe.",
    USER_NAME_REQUIRED: "El nombre es obligatorio.",
    USER_EMAIL_INVALID: "El email es obligatorio y debe tener un formato válido.",
    USER_EMAIL_DUPLICATED: "Ya existe un usuario registrado con ese email.",
    USER_PHONE_INVALID: "El teléfono es obligatorio y debe tener entre 8 y 15 dígitos.",
    USER_PASSWORD_INVALID: "La contraseña debe tener al menos 8 caracteres, con al menos una letra y un número.",
    USER_BLOCKED_INVALID: "El campo bloqueado debe ser verdadero o falso.",
    LOGIN_REQUIRED: "Debe iniciar sesión para realizar esta operación.",
    LOGIN_INVALID: "Email o contraseña incorrectos.",
    FORBIDDEN: "No tiene permisos para realizar esta operación.",

    // Pedidos
    ORDER_NOT_FOUND: "El pedido no existe.",
    ORDER_ITEMS_REQUIRED: "El pedido debe tener al menos un producto.",
    ORDER_ITEM_INVALID: "Cada producto del pedido debe tener un ID válido y una cantidad entre 1 y 20.",
    ORDER_OBSERVATIONS_INVALID: "Las observaciones deben ser un texto de hasta 200 caracteres.",
    ORDER_PICKUP_INVALID: "El horario de retiro debe tener formato HH:MM.",
    ORDER_PICKUP_OUT_OF_HOURS: "El horario de retiro debe estar entre las 8:00 y las 16:45.",
    ORDER_PICKUP_TOO_SOON: "El horario de retiro debe ser al menos 15 minutos posterior a la hora actual.",
    ORDER_PRODUCT_UNAVAILABLE: "El producto \"{nombre}\" no está disponible en este momento.",
    ORDER_LIMIT_REACHED: "No puede tener más de 2 pedidos activos al mismo tiempo.",
    ORDER_USER_BLOCKED: "Su cuenta está bloqueada para realizar pedidos. Comuníquese con el local.",
    ORDER_INVALID_TRANSITION: "No se puede pasar el pedido de {desde} a {hacia}.",
    ORDER_STATUS_INVALID: "El estado indicado no es válido.",
    ORDER_REJECT_REASON_REQUIRED: "Debe indicar un motivo para rechazar el pedido.",
    ORDER_CANCEL_NOT_ALLOWED: "El pedido solo puede cancelarse mientras está Pendiente o Confirmado.",
    ORDER_NOT_OWNER: "Solo puede operar sobre sus propios pedidos.",

    // Generales
    INVALID_DATA: "Los datos enviados son inválidos.",
    INVALID_JSON: "El cuerpo de la solicitud no es un JSON válido.",
    INVALID_ID: "El ID debe ser un número entero positivo.",
    ROUTE_NOT_FOUND: "La ruta solicitada no existe.",
    INTERNAL_ERROR: "Ocurrió un error inesperado. Intente nuevamente más tarde."
});
