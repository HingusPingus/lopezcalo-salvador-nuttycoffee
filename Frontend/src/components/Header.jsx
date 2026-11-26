import { NavLink, Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import { useAuth, ROLES } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useToast } from "./ToastProvider";

export default function Header() {
  const { user, isStaff, logout } = useAuth();
  const { count } = useCart();
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    // Se sale de la página actual antes de cerrar sesión para que las rutas
    // protegidas no redirijan al login.
    navigate("/");

    try {
      await logout();
      toast.success("Sesión cerrada correctamente.");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <header className="header">
      <div className="container header__inner">
        <Link to="/" className="brand">
          <img src={logo} alt="" width="36" height="36" />
          <span>Nutty Coffee</span>
        </Link>
        <nav aria-label="Navegación principal">
          <NavLink to="/" end>Inicio</NavLink>

          {user?.rol === ROLES.CLIENTE && <NavLink to="/mis-pedidos">Mis pedidos</NavLink>}
          {isStaff && <NavLink to="/panel">Panel</NavLink>}
          {user?.rol === ROLES.ADMINISTRADOR && (
            <>
              <NavLink to="/admin">Productos</NavLink>
              <NavLink to="/reportes">Reportes</NavLink>
              <NavLink to="/usuarios">Usuarios</NavLink>
            </>
          )}

          {!isStaff && (
            <NavLink to="/carrito" className="nav-cart" aria-label={`Carrito, ${count} productos`}>
              🛒{count > 0 && <span className="nav-cart__count" aria-hidden="true">{count}</span>}
            </NavLink>
          )}

          {user ? (
            <button type="button" className="nav-session" onClick={handleLogout}>
              Salir ({user.nombre.split(" ")[0]})
            </button>
          ) : (
            <NavLink to="/login">Iniciar sesión</NavLink>
          )}

          <NavLink to="/menu" className="nav-cta">Ver menú</NavLink>
        </nav>
      </div>
    </header>
  );
}
