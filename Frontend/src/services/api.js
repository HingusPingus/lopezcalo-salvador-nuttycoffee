const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const TOKEN_KEY = "nutty_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

// Cliente HTTP único: agrega el token de sesión y procesa la respuesta
// { success, data | message } del backend.
export async function request(path, options = {}) {
  const token = getToken();
  let response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers
      }
    });
  } catch {
    throw new Error("No se pudo conectar con el servidor. Verificá que el backend esté activo.");
  }

  const body = await response.json().catch(() => null);

  if (!response.ok || !body?.success) {
    throw new Error(body?.message || "Ocurrió un error inesperado.");
  }

  return body.data;
}
