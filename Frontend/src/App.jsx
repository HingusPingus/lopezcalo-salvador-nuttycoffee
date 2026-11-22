import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MenuPage from "./pages/MenuPage";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";
import ProductFormPage from "./pages/ProductFormPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <>
      <a href="#contenido" className="skip-link">Saltar al contenido</a>
      <Header />
      <main id="contenido">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/nuevo" element={<ProductFormPage />} />
          <Route path="/admin/:id/editar" element={<ProductFormPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
