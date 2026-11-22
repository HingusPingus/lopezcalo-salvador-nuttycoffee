const NAME_MIN = 3;
const NAME_MAX = 60;
const DESCRIPTION_MAX = 255;

// Replica las reglas del backend para dar feedback inmediato en el formulario.
export function validateProduct(values) {
  const errors = {};
  const name = values.nombre.trim();
  const price = Number(values.precio);

  if (!name) {
    errors.nombre = "El nombre es obligatorio.";
  } else if (name.length < NAME_MIN || name.length > NAME_MAX) {
    errors.nombre = `El nombre debe tener entre ${NAME_MIN} y ${NAME_MAX} caracteres.`;
  }

  if (values.precio === "" || Number.isNaN(price) || price <= 0) {
    errors.precio = "Ingresá un precio mayor a 0.";
  }

  if (!values.categoriaId) {
    errors.categoriaId = "Seleccioná una categoría.";
  }

  if (values.descripcion.length > DESCRIPTION_MAX) {
    errors.descripcion = `La descripción no puede superar ${DESCRIPTION_MAX} caracteres.`;
  }

  if (values.imagen.trim() && !/^https?:\/\/\S+$/i.test(values.imagen.trim())) {
    errors.imagen = "Ingresá una URL válida (http:// o https://).";
  }

  return errors;
}

export const DESCRIPTION_LIMIT = DESCRIPTION_MAX;
