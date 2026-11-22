import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import RequireAuth from "./components/RequireAuth";
import { ROLES } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import MenuPage from "./pages/MenuPage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import PanelPage from "./pages/PanelPage";
import AdminPage from "./pages/AdminPage";
import ProductFormPage from "./pages/ProductFormPage";
import ReportsPage from "./pages/ReportsPage";
import UsersPage from "./pages/UsersPage";
import NotFoundPage from "./pages/NotFoundPage";

const STAFF = [ROLES.EMPLEADO, ROLES.ADMINISTRADOR];
const ADMIN = [ROLES.ADMINISTRADOR];

export default function App() {
  return (
    <>
      <a href="#contenido" className="skip-link">Saltar al contenido</a>
      <Header />
      <main id="contenido">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/carrito" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />

          <Route path="/mis-pedidos" element={<RequireAuth roles={[ROLES.CLIENTE]}><MyOrdersPage /></RequireAuth>} />
          <Route path="/panel" element={<RequireAuth roles={STAFF}><PanelPage /></RequireAuth>} />

          <Route path="/admin" element={<RequireAuth roles={ADMIN}><AdminPage /></RequireAuth>} />
          <Route path="/admin/nuevo" element={<RequireAuth roles={ADMIN}><ProductFormPage /></RequireAuth>} />
          <Route path="/admin/:id/editar" element={<RequireAuth roles={ADMIN}><ProductFormPage /></RequireAuth>} />
          <Route path="/reportes" element={<RequireAuth roles={ADMIN}><ReportsPage /></RequireAuth>} />
          <Route path="/usuarios" element={<RequireAuth roles={ADMIN}><UsersPage /></RequireAuth>} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
