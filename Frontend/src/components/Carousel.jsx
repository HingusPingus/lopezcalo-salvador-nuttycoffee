import { useRef } from "react";

// Carrusel horizontal accesible, con botones de desplazamiento.
export default function Carousel({ label, children }) {
  const trackRef = useRef(null);

  const scrollBy = (direction) => {
    const track = trackRef.current;
    track?.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div className="carousel" role="region" aria-label={label}>
      <button
        type="button"
        className="carousel__arrow"
        onClick={() => scrollBy(-1)}
        aria-label="Ver anteriores"
      >
        ‹
      </button>
      <ul className="carousel__track" ref={trackRef}>
        {children}
      </ul>
      <button
        type="button"
        className="carousel__arrow"
        onClick={() => scrollBy(1)}
        aria-label="Ver siguientes"
      >
        ›
      </button>
    </div>
  );
}
