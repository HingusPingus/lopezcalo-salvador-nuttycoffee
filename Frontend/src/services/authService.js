import { request, setToken, clearToken, getToken } from "./api";

export async function register(data) {
  const session = await request("/auth/registro", { method: "POST", body: JSON.stringify(data) });
  setToken(session.token);
  return session.usuario;
}

export async function login(credentials) {
  const session = await request("/auth/login", { method: "POST", body: JSON.stringify(credentials) });
  setToken(session.token);
  return session.usuario;
}

export async function logout() {
  try {
    await request("/auth/logout", { method: "POST" });
  } finally {
    clearToken();
  }
}

export async function getCurrentUser() {
  if (!getToken()) {
    return null;
  }

  try {
    return await request("/auth/me");
  } catch {
    clearToken();
    return null;
  }
}
