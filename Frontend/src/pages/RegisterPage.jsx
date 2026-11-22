import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ToastProvider";
import FormField from "../components/FormField";
import Button from "../components/Button";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TELEFONO_REGEX = /^\d{8,15}$/;
const CONTRASENA_REGEX = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;

// Replica las reglas del backend para dar feedback inmediato.
function validate(values) {
  const errors = {};

  if (!values.nombre.trim()) errors.nombre = "El nombre es obligatorio.";
  if (!EMAIL_REGEX.test(values.email.trim())) errors.email = "Ingresá un email válido.";
  if (!TELEFONO_REGEX.test(values.telefono.trim())) errors.telefono = "Solo números, entre 8 y 15 dígitos.";
  if (!CONTRASENA_REGEX.test(values.contrasena)) {
    errors.contrasena = "Mínimo 8 caracteres, con al menos una letra y un número.";
  }
  if (values.confirmacion !== values.contrasena) errors.confirmacion = "Las contraseñas no coinciden.";

  return errors;
}

export default function RegisterPage() {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [values, setValues] = useState({ nombre: "", email: "", telefono: "", contrasena: "", confirmacion: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validation = validate(values);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setSubmitting(true);

    try {
      const user = await register({
        nombre: values.nombre.trim(),
        email: values.email.trim(),
        telefono: values.telefono.trim(),
        contrasena: values.contrasena
      });
      toast.success(`¡Bienvenido, ${user.nombre}! Tu cuenta fue creada.`);
      navigate("/menu");
    } catch (err) {
      toast.error(err.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="container page page--narrow">
      <h1>Crear cuenta</h1>
      <form className="form" onSubmit={handleSubmit} noValidate>
        <FormField label="Nombre" name="nombre" required value={values.nombre} onChange={handleChange} error={errors.nombre} autoComplete="name" />
        <FormField label="Email" name="email" type="email" required value={values.email} onChange={handleChange} error={errors.email} autoComplete="email" />
        <FormField label="Teléfono" name="telefono" type="tel" required value={values.telefono} onChange={handleChange} error={errors.telefono} hint="Solo números, entre 8 y 15 dígitos." autoComplete="tel" />
        <FormField label="Contraseña" name="contrasena" type="password" required value={values.contrasena} onChange={handleChange} error={errors.contrasena} hint="Mínimo 8 caracteres, con al menos una letra y un número." autoComplete="new-password" />
        <FormField label="Confirmar contraseña" name="confirmacion" type="password" required value={values.confirmacion} onChange={handleChange} error={errors.confirmacion} autoComplete="new-password" />
        <div className="form__actions">
          <Button type="submit" loading={submitting}>Registrarme</Button>
        </div>
        <p className="form__alt">
          ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
        </p>
      </form>
    </div>
  );
}
