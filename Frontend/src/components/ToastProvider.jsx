import { createContext, useCallback, useContext, useMemo, useState } from "react";

const ToastContext = createContext(null);
const DURATION_MS = 4500;

// Sistema único de notificaciones laterales para éxitos y errores.
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const notify = useCallback((type, message) => {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { id, type, message }]);
    setTimeout(() => dismiss(id), DURATION_MS);
  }, [dismiss]);

  const api = useMemo(() => ({
    success: (message) => notify("success", message),
    error: (message) => notify("error", message)
  }), [notify]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="toast-container" aria-live="polite">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast toast--${toast.type}`}
            role={toast.type === "error" ? "alert" : "status"}
          >
            <span>{toast.message}</span>
            <button
              type="button"
              className="toast__close"
              onClick={() => dismiss(toast.id)}
              aria-label="Cerrar notificación"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast debe usarse dentro de ToastProvider");
  }

  return context;
}
