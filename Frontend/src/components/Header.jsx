import { NavLink, Link } from "react-router-dom";
import logo from "../assets/logo.svg";

export default function Header() {
  return (
    <header className="header">
      <div className="container header__inner">
        <Link to="/" className="brand">
          <img src={logo} alt="" width="36" height="36" />
          <span>Nutty Coffee</span>
        </Link>
        <nav aria-label="Navegación principal">
          <NavLink to="/" end>Inicio</NavLink>
          <NavLink to="/admin">Administrar</NavLink>
          <NavLink to="/menu" className="nav-cta">Ver menú</NavLink>
        </nav>
      </div>
    </header>
  );
}
