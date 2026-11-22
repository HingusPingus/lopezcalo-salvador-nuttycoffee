import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../services/productService";
import ProductCard from "../components/ProductCard";
import Carousel from "../components/Carousel";
import Spinner from "../components/Spinner";
import StatusMessage from "../components/StatusMessage";

const CONTACTS = [
  { label: "Teléfono", value: "+54 11 5555-0199", href: "tel:+541155550199" },
  { label: "Instagram", value: "@nuttycoffee.ba", href: "https://instagram.com/nuttycoffee.ba" },
  { label: "Dirección", value: "Av. Siempreviva 742, CABA", href: null },
  { label: "Horario", value: "Lunes a sábados de 8:00 a 17:00", href: null }
];

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    getProducts()
      .then((products) => {
        if (!cancelled) {
          setFeatured(products.filter((product) => product.destacado && product.activo));
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  return (
    <>
      <section className="hero hero--home">
        <div className="container">
          <h1>Bienvenidos a Nutty Coffee</h1>
          <p>Café de especialidad, pastelería artesanal y comida casera para disfrutar o llevar.</p>
          <Link to="/menu" className="btn btn--accent btn--large">Ver menú</Link>
        </div>
      </section>

      <section className="section" aria-labelledby="featured-title">
        <div className="container">
          <h2 id="featured-title">Platos estrella</h2>
          {loading && <Spinner label="Cargando platos estrella..." />}
          {!loading && error && <StatusMessage title="No pudimos cargar los destacados" message={error} />}
          {!loading && !error && (featured.length === 0 ? (
            <p className="empty">Todavía no hay platos destacados.</p>
          ) : (
            <Carousel label="Platos estrella">
              {featured.map((product) => (
                <li key={product.id} className="carousel__item">
                  <ProductCard product={product} />
                </li>
              ))}
            </Carousel>
          ))}
        </div>
      </section>

      <section className="section section--alt" aria-labelledby="about-title">
        <div className="container section--narrow">
          <h2 id="about-title">Sobre nosotros</h2>
          <p>
            Nutty Coffee nació del amor por el café bien hecho. Tostamos granos de origen,
            horneamos nuestra pastelería todos los días y preparamos comida simple y rica
            con ingredientes frescos. Un lugar para trabajar, charlar o simplemente
            disfrutar de un buen flat white.
          </p>
        </div>
      </section>

      <section className="section" aria-labelledby="contact-title">
        <div className="container">
          <h2 id="contact-title">Contactos</h2>
          <ul className="contact-list">
            {CONTACTS.map((contact) => (
              <li key={contact.label} className="contact-card">
                <h3>{contact.label}</h3>
                {contact.href ? (
                  <a href={contact.href} target={contact.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                    {contact.value}
                  </a>
                ) : (
                  <p>{contact.value}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
