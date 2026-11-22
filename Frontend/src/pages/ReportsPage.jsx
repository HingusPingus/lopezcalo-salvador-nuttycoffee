import { useCallback, useEffect, useState } from "react";
import { getSalesReport } from "../services/reportService";
import Spinner from "../components/Spinner";
import StatusMessage from "../components/StatusMessage";
import { formatPrice } from "../utils/formatPrice";

// La fecha llega como "AAAA-MM-DD"; se formatea sin pasar por Date para evitar desfases de zona horaria.
const formatDay = (fecha) => fecha.split("-").reverse().join("/");

export default function ReportsPage() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      setReport(await getSalesReport());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="container page">
      <h1>Reportes de ventas</h1>

      {loading && <Spinner label="Cargando reportes..." />}
      {!loading && error && <StatusMessage title="No pudimos cargar los reportes" message={error} onRetry={load} />}

      {!loading && !error && report && (
        <div className="panel">
          <section aria-labelledby="sales-title">
            <h2 id="sales-title">Ventas por día</h2>
            {report.ventasPorDia.length === 0 ? (
              <p className="empty">Todavía no hay pedidos entregados.</p>
            ) : (
              <div className="table-wrap">
                <table className="table">
                  <caption className="sr-only">Ventas por día</caption>
                  <thead>
                    <tr>
                      <th scope="col">Fecha</th>
                      <th scope="col">Pedidos</th>
                      <th scope="col">Total vendido</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.ventasPorDia.map((day) => (
                      <tr key={day.fecha}>
                        <td>{formatDay(day.fecha)}</td>
                        <td>{day.cantidadPedidos}</td>
                        <td>{formatPrice(day.totalVendido)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section aria-labelledby="top-title">
            <h2 id="top-title">Productos más pedidos</h2>
            {report.productosMasPedidos.length === 0 ? (
              <p className="empty">Sin datos por ahora.</p>
            ) : (
              <div className="table-wrap">
                <table className="table">
                  <caption className="sr-only">Productos más pedidos</caption>
                  <thead>
                    <tr>
                      <th scope="col">Producto</th>
                      <th scope="col">Unidades</th>
                      <th scope="col">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.productosMasPedidos.map((product) => (
                      <tr key={product.id}>
                        <td>{product.nombre}</td>
                        <td>{product.unidades}</td>
                        <td>{formatPrice(product.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
