import { request } from "./api";

export const getUsers = () => request("/usuarios");

export const setUserBlocked = (id, bloqueado) =>
  request(`/usuarios/${id}/bloqueo`, { method: "PATCH", body: JSON.stringify({ bloqueado }) });
