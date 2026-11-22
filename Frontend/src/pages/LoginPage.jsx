import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ToastProvider";
import FormField from "../components/FormField";
import Button from "../components/Button";

export default function LoginPage() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [values, setValues] = useState({ email: "", contrasena: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validation = {};
    if (!values.email.trim()) validation.email = "Ingresá tu email.";
    if (!values.contrasena) validation.contrasena = "Ingresá tu contraseña.";
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setSubmitting(true);

    try {
      const user = await login(values);
      toast.success(`¡Hola, ${user.nombre}!`);
      navigate(location.state?.from ?? "/", { replace: true });
    } catch (err) {
      toast.error(err.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="container page page--narrow">
      <h1>Iniciar sesión</h1>
      <form className="form" onSubmit={handleSubmit} noValidate>
        <FormField label="Email" name="email" type="email" required value={values.email} onChange={handleChange} error={errors.email} autoComplete="email" />
        <FormField label="Contraseña" name="contrasena" type="password" required value={values.contrasena} onChange={handleChange} error={errors.contrasena} autoComplete="current-password" />
        <div className="form__actions">
          <Button type="submit" loading={submitting}>Ingresar</Button>
        </div>
        <p className="form__alt">
          ¿No tenés cuenta? <Link to="/registro">Registrate</Link>
        </p>
      </form>
    </div>
  );
}
