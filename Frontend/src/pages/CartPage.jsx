import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth, ROLES } from "../context/AuthContext";
import { useToast } from "../components/ToastProvider";
import { createOrder } from "../services/orderService";
import Button from "../components/Button";
import FormField from "../components/FormField";
import defaultImage from "../assets/producto-default.svg";
import { formatPrice } from "../utils/formatPrice";
import { getPickupSlots } from "../utils/horarios";

export default function CartPage() {
  const { items, total, setQuantity, setObservations, removeItem, clear } = useCart();
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const slots = useMemo(() => getPickupSlots(), []);
  const [horarioRetiro, setHorarioRetiro] = useState("");
  const [observaciones, setObservacionesPedido] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user) {
      toast.error("Iniciá sesión para confirmar tu pedido.");
      navigate("/login", { state: { from: "/carrito" } });
      return;
    }

    const validation = {};
    if (!horarioRetiro) validation.horarioRetiro = "Elegí un horario de retiro.";
    if (observaciones.length > 200) validation.observaciones = "Máximo 200 caracteres.";
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setSubmitting(true);

    try {
      const order = await createOrder({
        horarioRetiro,
        observaciones: observaciones.trim(),
        items: items.map((item) => ({
          productoId: item.producto.id,
          cantidad: item.cantidad,
          observaciones: item.observaciones.trim()
        }))
      });
      clear();
      toast.success(`¡Pedido #${order.id} confirmado! Te esperamos a las ${horarioRetiro}.`);
      navigate("/mis-pedidos");
    } catch (err) {
      toast.error(err.message);
      setSubmitting(false);
    }
  };

  if (user && user.rol !== ROLES.CLIENTE) {
    return (
      <div className="container page">
        <h1>Carrito</h1>
        <p className="empty">El carrito está disponible solo para clientes.</p>
      </div>
    );
  }

  return (
    <div className="container page page--narrow">
      <h1>Tu pedido</h1>

      {items.length === 0 ? (
        <div className="empty">
          <p>Tu carrito está vacío.</p>
          <Link to="/menu" className="btn btn--accent">Ver menú</Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <ul className="cart-list">
            {items.map(({ producto, cantidad, observaciones: obs }) => (
              <li key={producto.id} className="cart-item">
                <img src={producto.imagen || defaultImage} alt="" width="64" height="48" />
                <div className="cart-item__info">
                  <strong>{producto.nombre}</strong>
                  <span>{formatPrice(producto.precio)} c/u</span>
                  <label className="cart-item__obs">
                    <span className="sr-only">Observaciones para {producto.nombre}</span>
                    <input
                      type="text"
                      placeholder="Observaciones (ej.: leche de almendras)"
                      maxLength="200"
                      value={obs}
                      onChange={(event) => setObservations(producto.id, event.target.value)}
                    />
                  </label>
                </div>
                <div className="cart-item__qty" role="group" aria-label={`Cantidad de ${producto.nombre}`}>
                  <button type="button" onClick={() => setQuantity(producto.id, cantidad - 1)} disabled={cantidad <= 1} aria-label="Quitar uno">−</button>
                  <span aria-live="polite">{cantidad}</span>
                  <button type="button" onClick={() => setQuantity(producto.id, cantidad + 1)} disabled={cantidad >= 20} aria-label="Agregar uno">+</button>
                </div>
                <div className="cart-item__right">
                  <strong>{formatPrice(producto.precio * cantidad)}</strong>
                  <button type="button" className="link-danger" onClick={() => removeItem(producto.id)}>
                    Quitar
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="form cart-checkout">
            {slots.length === 0 ? (
              <p className="field__error">
                El local está cerrado. Los pedidos se pueden retirar de 8:00 a 16:45.
              </p>
            ) : (
              <FormField
                label="Horario de retiro"
                name="horarioRetiro"
                as="select"
                required
                value={horarioRetiro}
                onChange={(event) => { setHorarioRetiro(event.target.value); setErrors({}); }}
                error={errors.horarioRetiro}
                hint="Pedidos para hoy, con al menos 15 minutos de anticipación."
              >
                <option value="">Seleccionar...</option>
                {slots.map((slot) => <option key={slot} value={slot}>{slot} hs</option>)}
              </FormField>
            )}

            <FormField
              label="Observaciones del pedido"
              name="observaciones"
              as="textarea"
              rows="2"
              maxLength="200"
              value={observaciones}
              onChange={(event) => setObservacionesPedido(event.target.value)}
              error={errors.observaciones}
              hint={`${observaciones.length}/200 caracteres. Opcional.`}
            />

            <div className="cart-total">
              <span>Total</span>
              <strong>{formatPrice(total)}</strong>
            </div>

            <div className="form__actions">
              <Button variant="secondary" onClick={clear} disabled={submitting}>Vaciar carrito</Button>
              <Button type="submit" variant="accent" loading={submitting} disabled={slots.length === 0}>
                {user ? "Confirmar pedido" : "Iniciar sesión y pedir"}
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
