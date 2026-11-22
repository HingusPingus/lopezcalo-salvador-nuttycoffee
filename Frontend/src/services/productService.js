import { request } from "./api";

export const getProducts = () => request("/productos");

export const getProductById = (id) => request(`/productos/${id}`);

export const createProduct = (product) =>
  request("/productos", { method: "POST", body: JSON.stringify(product) });

export const updateProduct = (id, product) =>
  request(`/productos/${id}`, { method: "PUT", body: JSON.stringify(product) });

export const deleteProduct = (id) => request(`/productos/${id}`, { method: "DELETE" });

export const setProductAvailability = (id, disponible) =>
  request(`/productos/${id}/disponibilidad`, {
    method: "PATCH",
    body: JSON.stringify({ disponible })
  });
