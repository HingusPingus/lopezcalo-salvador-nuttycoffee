import { request } from "./api";

export const createOrder = (order) =>
  request("/pedidos", { method: "POST", body: JSON.stringify(order) });

export const getMyOrders = () => request("/pedidos/mios");

export const getAllOrders = () => request("/pedidos");

export const changeOrderStatus = (id, estado, motivoRechazo) =>
  request(`/pedidos/${id}/estado`, {
    method: "PATCH",
    body: JSON.stringify({ estado, motivoRechazo })
  });
