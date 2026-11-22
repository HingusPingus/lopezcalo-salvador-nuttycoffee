import { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as authService from "../services/authService";

const AuthContext = createContext(null);

export const ROLES = Object.freeze({
  CLIENTE: "CLIENTE",
  EMPLEADO: "EMPLEADO",
  ADMINISTRADOR: "ADMINISTRADOR"
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService.getCurrentUser()
      .then(setUser)
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    isStaff: user && user.rol !== ROLES.CLIENTE,
    async login(credentials) {
      const logged = await authService.login(credentials);
      setUser(logged);
      return logged;
    },
    async register(data) {
      const registered = await authService.register(data);
      setUser(registered);
      return registered;
    },
    async logout() {
      await authService.logout();
      setUser(null);
    }
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }

  return context;
}
