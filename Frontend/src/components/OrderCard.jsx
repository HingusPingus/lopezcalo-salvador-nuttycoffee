import EstadoBadge from "./EstadoBadge";
import { formatPrice } from "../utils/formatPrice";
import { formatTime, formatDate } from "../utils/horarios";

// Tarjeta de pedido reutilizada por el cliente (Mis pedidos) y el panel del local.
export default function OrderCard({ order, showClient = false, actions }) {
  return (
    <article className="order">
      <header className="order__header">
        <div>
          <h3>Pedido #{order.id}</h3>
          <p className="order__meta">
            {formatDate(order.fechaCreacion)} · Retiro: {formatTime(order.horarioRetiro)}
            {showClient && ` · ${order.cliente.nombre} (${order.cliente.telefono})`}
          </p>
        </div>
        <EstadoBadge estado={order.estado} />
      </header>

      <ul className="order__items">
        {order.detalles.map((detalle) => (
          <li key={detalle.id}>
            <span>
              {detalle.cantidad} × {detalle.producto.nombre}
              {detalle.observaciones && <em className="order__obs"> — {detalle.observaciones}</em>}
            </span>
            <span>{formatPrice(detalle.precioUnitario * detalle.cantidad)}</span>
          </li>
        ))}
      </ul>

      {order.observaciones && <p className="order__obs">Observaciones: {order.observaciones}</p>}
      {order.motivoRechazo && <p className="order__reject">Motivo del rechazo: {order.motivoRechazo}</p>}

      <footer className="order__footer">
        <strong>Total: {formatPrice(order.total)}</strong>
        {actions && <div className="order__actions">{actions}</div>}
      </footer>
    </article>
  );
}
