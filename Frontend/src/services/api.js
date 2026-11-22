const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Cliente HTTP único: procesa la respuesta { success, data | message } del backend.
export async function request(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options
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
