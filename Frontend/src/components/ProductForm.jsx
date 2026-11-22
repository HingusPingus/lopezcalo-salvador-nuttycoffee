import { useState } from "react";
import FormField from "./FormField";
import Button from "./Button";
import { validateProduct, DESCRIPTION_LIMIT } from "../utils/validateProduct";

const EMPTY = {
  nombre: "",
  descripcion: "",
  precio: "",
  imagen: "",
  categoriaId: "",
  destacado: false,
  disponible: true
};

export function productToFormValues(product) {
  return {
    nombre: product.nombre,
    descripcion: product.descripcion ?? "",
    precio: String(product.precio),
    imagen: product.imagen ?? "",
    categoriaId: String(product.categoria.id),
    destacado: product.destacado,
    disponible: product.disponible
  };
}

export default function ProductForm({ initialValues = EMPTY, categories, submitting, submitLabel, onSubmit, onCancel }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, type, value, checked } = event.target;
    setValues((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validateProduct(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      document.querySelector("[aria-invalid='true']")?.focus();
      return;
    }

    onSubmit({
      nombre: values.nombre.trim(),
      descripcion: values.descripcion.trim(),
      precio: Number(values.precio),
      imagen: values.imagen.trim() || null,
      categoriaId: Number(values.categoriaId),
      destacado: values.destacado,
      disponible: values.disponible
    });
  };

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <FormField label="Nombre" name="nombre" required value={values.nombre} onChange={handleChange} error={errors.nombre} maxLength={60} />

      <FormField label="Categoría" name="categoriaId" as="select" required value={values.categoriaId} onChange={handleChange} error={errors.categoriaId}>
        <option value="">Seleccionar...</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>{category.nombre}</option>
        ))}
      </FormField>

      <FormField label="Precio (ARS)" name="precio" type="number" min="0" step="1" required value={values.precio} onChange={handleChange} error={errors.precio} />

      <FormField
        label="Descripción"
        name="descripcion"
        as="textarea"
        rows="3"
        value={values.descripcion}
        onChange={handleChange}
        error={errors.descripcion}
        hint={`${values.descripcion.length}/${DESCRIPTION_LIMIT} caracteres`}
      />

      <FormField label="URL de la imagen" name="imagen" type="url" placeholder="https://..." value={values.imagen} onChange={handleChange} error={errors.imagen} hint="Opcional." />

      <fieldset className="form__checks">
        <legend>Opciones</legend>
        <label><input type="checkbox" name="destacado" checked={values.destacado} onChange={handleChange} /> Producto destacado</label>
        <label><input type="checkbox" name="disponible" checked={values.disponible} onChange={handleChange} /> Disponible</label>
      </fieldset>

      <div className="form__actions">
        <Button variant="secondary" onClick={onCancel} disabled={submitting}>Cancelar</Button>
        <Button type="submit" loading={submitting}>{submitLabel}</Button>
      </div>
    </form>
  );
}
