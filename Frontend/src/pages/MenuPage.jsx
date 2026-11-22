import { useMemo, useState } from "react";
import useCatalog from "../hooks/useCatalog";
import ProductCard from "../components/ProductCard";
import Spinner from "../components/Spinner";
import StatusMessage from "../components/StatusMessage";

export default function MenuPage() {
  const { products, categories, loading, error, reload } = useCatalog();
  const [categoryId, setCategoryId] = useState(null);

  const visible = useMemo(
    () => products.filter((product) => product.activo && (categoryId === null || product.categoria.id === categoryId)),
    [products, categoryId]
  );

  return (
    <>
      <section className="hero">
        <div className="container">
          <h1>Nuestro menú</h1>
          <p>Café de especialidad y sabores caseros, preparados cada día.</p>
        </div>
      </section>

      <div className="container">
        {loading && <Spinner label="Cargando menú..." />}
        {!loading && error && <StatusMessage title="No pudimos cargar el menú" message={error} onRetry={reload} />}

        {!loading && !error && (
          <>
            <div className="filters" role="group" aria-label="Filtrar por categoría">
              <button type="button" className="chip" aria-pressed={categoryId === null} onClick={() => setCategoryId(null)}>Todos</button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  className="chip"
                  aria-pressed={categoryId === category.id}
                  onClick={() => setCategoryId(category.id)}
                >
                  {category.nombre}
                </button>
              ))}
            </div>

            {visible.length === 0 ? (
              <p className="empty">No hay productos en esta categoría.</p>
            ) : (
              <div className="grid">
                {visible.map((product) => <ProductCard key={product.id} product={product} />)}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
