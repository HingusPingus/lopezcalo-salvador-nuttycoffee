import { useState } from "react";
import { Link } from "react-router-dom";
import useCatalog from "../hooks/useCatalog";
import { deleteProduct } from "../services/productService";
import { useToast } from "../components/ToastProvider";
import ConfirmDialog from "../components/ConfirmDialog";
import Spinner from "../components/Spinner";
import StatusMessage from "../components/StatusMessage";
import { formatPrice } from "../utils/formatPrice";

export default function AdminPage() {
  const { products, loading, error, reload } = useCatalog();
  const toast = useToast();
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);

    try {
      await deleteProduct(toDelete.id);
      toast.success(`"${toDelete.nombre}" se eliminó correctamente.`);
      setToDelete(null);
      await reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="container page">
      <div className="page__header">
        <h1>Administrar productos</h1>
        <Link to="/admin/nuevo" className="btn btn--primary">Nuevo producto</Link>
      </div>

      {loading && <Spinner label="Cargando productos..." />}
      {!loading && error && <StatusMessage title="No pudimos cargar los productos" message={error} onRetry={reload} />}

      {!loading && !error && (products.length === 0 ? (
        <p className="empty">Todavía no hay productos cargados.</p>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <caption className="sr-only">Listado de productos</caption>
            <thead>
              <tr>
                <th scope="col">Nombre</th>
                <th scope="col">Categoría</th>
                <th scope="col">Precio</th>
                <th scope="col">Estado</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.nombre}</td>
                  <td>{product.categoria.nombre}</td>
                  <td>{formatPrice(product.precio)}</td>
                  <td>{product.disponible ? "Disponible" : "Sin stock"}{product.destacado && " · ★"}</td>
                  <td className="table__actions">
                    <Link to={`/admin/${product.id}/editar`} className="btn btn--secondary btn--small" aria-label={`Editar ${product.nombre}`}>Editar</Link>
                    <button type="button" className="btn btn--danger btn--small" onClick={() => setToDelete(product)} aria-label={`Eliminar ${product.nombre}`}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Eliminar producto"
        message={toDelete ? `¿Seguro que querés eliminar "${toDelete.nombre}"? Esta acción no se puede deshacer.` : ""}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
