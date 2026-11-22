import defaultImage from "../assets/producto-default.svg";
import { formatPrice } from "../utils/formatPrice";

export default function ProductCard({ product, action }) {
  return (
    <article className="card">
      <img
        className="card__image"
        src={product.imagen || defaultImage}
        alt={product.imagen ? product.nombre : `${product.nombre} (imagen ilustrativa)`}
        loading="lazy"
        onError={(event) => { event.currentTarget.src = defaultImage; }}
      />
      <div className="card__body">
        <div className="card__tags">
          <span className="tag">{product.categoria.nombre}</span>
          {product.destacado && <span className="tag tag--featured">★ Destacado</span>}
          {!product.disponible && <span className="tag tag--off">Sin stock</span>}
        </div>
        <h3>{product.nombre}</h3>
        <p className="card__description">{product.descripcion}</p>
        <div className="card__footer">
          <p className="card__price">{formatPrice(product.precio)}</p>
          {action}
        </div>
      </div>
    </article>
  );
}
