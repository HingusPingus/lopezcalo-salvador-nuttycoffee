import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createProduct, getProductById, updateProduct } from "../services/productService";
import { getCategories } from "../services/categoryService";
import { useToast } from "../components/ToastProvider";
import ProductForm, { productToFormValues } from "../components/ProductForm";
import Spinner from "../components/Spinner";
import StatusMessage from "../components/StatusMessage";

export default function ProductFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const toast = useToast();

  const [categories, setCategories] = useState([]);
  const [initialValues, setInitialValues] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const [categoriesData, product] = await Promise.all([
          getCategories(),
          isEdit ? getProductById(id) : Promise.resolve(null)
        ]);

        if (cancelled) return;
        setCategories(categoriesData);
        setInitialValues(product ? productToFormValues(product) : undefined);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [id, isEdit]);

  const handleSubmit = async (data) => {
    setSubmitting(true);

    try {
      if (isEdit) {
        await updateProduct(id, data);
        toast.success("Producto actualizado correctamente.");
      } else {
        await createProduct(data);
        toast.success("Producto creado correctamente.");
      }
      navigate("/admin");
    } catch (err) {
      toast.error(err.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="container page page--narrow">
      <h1>{isEdit ? "Editar producto" : "Nuevo producto"}</h1>

      {loading && <Spinner />}
      {!loading && error && <StatusMessage title="No pudimos cargar el formulario" message={error} />}
      {!loading && !error && (
        <ProductForm
          initialValues={initialValues}
          categories={categories}
          submitting={submitting}
          submitLabel={isEdit ? "Guardar cambios" : "Crear producto"}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/admin")}
        />
      )}
    </div>
  );
}
