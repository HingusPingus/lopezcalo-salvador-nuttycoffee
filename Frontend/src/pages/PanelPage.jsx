import { useCallback, useEffect, useRef, useState } from "react";
import { getAllOrders, changeOrderStatus } from "../services/orderService";
import { getProducts, setProductAvailability } from "../services/productService";
import { useToast } from "../components/ToastProvider";
import OrderCard from "../components/OrderCard";
import Spinner from "../components/Spinner";
import StatusMessage from "../components/StatusMessage";
import Button from "../components/Button";
import FormField from "../components/FormField";
import { ACCIONES_PANEL } from "../utils/estados";

const esDeHoy = (fecha) => new Date(fecha).toDateString() === new Date().toDateString();

export default function PanelPage() {
  const toast = useToast();

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [toReject, setToReject] = useState(null);
  const [motivo, setMotivo] = useState("");
  const [motivoError, setMotivoError] = useState("");
  const motivoRef = useRef(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [ordersData, productsData] = await Promise.all([getAllOrders(), getProducts()]);
      setOrders(ordersData);
      setProducts(productsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const applyStatus = async (order, estado, motivoRechazo) => {
    setUpdatingId(order.id);

    try {
      await changeOrderStatus(order.id, estado, motivoRechazo);
      toast.success(`Pedido #${order.id} actualizado.`);
      setToReject(null);
      setMotivo("");
      await load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleAction = (order, action) => {
    if (action.estado === "RECHAZADO") {
      setToReject(order);
      setMotivo("");
      setMotivoError("");
      return;
    }

    applyStatus(order, action.estado);
  };

  const handleReject = (event) => {
    event.preventDefault();

    if (!motivo.trim()) {
      setMotivoError("Indicá el motivo del rechazo.");
      motivoRef.current?.querySelector("textarea")?.focus();
      return;
    }

    applyStatus(toReject, "RECHAZADO", motivo.trim());
  };

  const handleAvailability = async (product) => {
    try {
      await setProductAvailability(product.id, !product.disponible);
      toast.success(`"${product.nombre}" ahora está ${product.disponible ? "agotado" : "disponible"}.`);
      await load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const ordersToday = orders.filter((order) => esDeHoy(order.fechaCreacion));

  return (
    <div className="container page">
      <h1>Panel del local</h1>

      {loading && <Spinner label="Cargando panel..." />}
      {!loading && error && <StatusMessage title="No pudimos cargar el panel" message={error} onRetry={load} />}

      {!loading && !error && (
        <div className="panel">
          <section aria-labelledby="orders-title">
            <h2 id="orders-title">Pedidos del día</h2>
            {ordersToday.length === 0 ? (
              <p className="empty">No hay pedidos por ahora.</p>
            ) : (
              <div className="order-list">
                {ordersToday.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    showClient
                    actions={(ACCIONES_PANEL[order.estado] ?? []).map((action) => (
                      <Button
                        key={action.estado}
                        variant={action.variant}
                        loading={updatingId === order.id}
                        onClick={() => handleAction(order, action)}
                      >
                        {action.label}
                      </Button>
                    ))}
                  />
                ))}
              </div>
            )}
          </section>

          <section aria-labelledby="availability-title">
            <h2 id="availability-title">Disponibilidad de productos</h2>
            <ul className="availability-list">
              {products.filter((product) => product.activo).map((product) => (
                <li key={product.id} className="availability-item">
                  <span>
                    {product.nombre}
                    {!product.disponible && <em className="tag tag--off">Agotado</em>}
                  </span>
                  <Button
                    variant={product.disponible ? "secondary" : "primary"}
                    onClick={() => handleAvailability(product)}
                  >
                    {product.disponible ? "Marcar agotado" : "Marcar disponible"}
                  </Button>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}

      {toReject && (
        <div className="modal-backdrop">
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="reject-title">
            <h2 id="reject-title">Rechazar pedido #{toReject.id}</h2>
            <form onSubmit={handleReject} noValidate ref={motivoRef}>
              <FormField
                label="Motivo del rechazo"
                name="motivo"
                as="textarea"
                rows="2"
                required
                maxLength="200"
                value={motivo}
                onChange={(event) => { setMotivo(event.target.value); setMotivoError(""); }}
                error={motivoError}
              />
              <div className="modal__actions">
                <Button variant="secondary" onClick={() => setToReject(null)}>Volver</Button>
                <Button type="submit" variant="danger" loading={updatingId === toReject.id}>Rechazar</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
