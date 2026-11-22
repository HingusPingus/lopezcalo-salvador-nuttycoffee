import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMyOrders, changeOrderStatus } from "../services/orderService";
import { getProducts } from "../services/productService";
import { useCart } from "../context/CartContext";
import { useToast } from "../components/ToastProvider";
import OrderCard from "../components/OrderCard";
import ConfirmDialog from "../components/ConfirmDialog";
import Spinner from "../components/Spinner";
import StatusMessage from "../components/StatusMessage";
import Button from "../components/Button";
import { PUEDE_CANCELAR } from "../utils/estados";

export default function MyOrdersPage() {
  const toast = useToast();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toCancel, setToCancel] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      setOrders(await getMyOrders());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleCancel = async () => {
    setCancelling(true);

    try {
      await changeOrderStatus(toCancel.id, "CANCELADO");
      toast.success(`El pedido #${toCancel.id} fue cancelado.`);
      setToCancel(null);
      await load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setCancelling(false);
    }
  };

  // Vuelve a cargar en el carrito los productos de un pedido anterior.
  const handleRepeat = async (order) => {
    try {
      const products = await getProducts();
      let skipped = 0;

      for (const detalle of order.detalles) {
        const producto = products.find(
          (item) => item.id === detalle.producto.id && item.activo && item.disponible
        );

        if (producto) {
          addItem(producto, detalle.cantidad);
        } else {
          skipped += 1;
        }
      }

      if (skipped === order.detalles.length) {
        toast.error("Ninguno de los productos de ese pedido está disponible hoy.");
        return;
      }

      if (skipped > 0) {
        toast.error(`${skipped} producto(s) ya no están disponibles y no se agregaron.`);
      }

      toast.success("Productos agregados al carrito.");
      navigate("/carrito");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="container page page--narrow">
      <h1>Mis pedidos</h1>

      {loading && <Spinner label="Cargando tus pedidos..." />}
      {!loading && error && <StatusMessage title="No pudimos cargar tus pedidos" message={error} onRetry={load} />}

      {!loading && !error && (orders.length === 0 ? (
        <div className="empty">
          <p>Todavía no hiciste ningún pedido.</p>
          <Link to="/menu" className="btn btn--accent">Ver menú</Link>
        </div>
      ) : (
        <div className="order-list">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              actions={
                <>
                  {PUEDE_CANCELAR.includes(order.estado) && (
                    <Button variant="danger" onClick={() => setToCancel(order)}>Cancelar</Button>
                  )}
                  <Button variant="secondary" onClick={() => handleRepeat(order)}>Repetir</Button>
                </>
              }
            />
          ))}
        </div>
      ))}

      <ConfirmDialog
        open={Boolean(toCancel)}
        title="Cancelar pedido"
        message={toCancel ? `¿Seguro que querés cancelar el pedido #${toCancel.id}?` : ""}
        confirmLabel="Cancelar pedido"
        loading={cancelling}
        onConfirm={handleCancel}
        onCancel={() => setToCancel(null)}
      />
    </div>
  );
}
