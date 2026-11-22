import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "nutty_cart";
const MAX_CANTIDAD = 20;

const loadCart = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
  } catch {
    return [];
  }
};

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo(() => ({
    items,
    count: items.reduce((total, item) => total + item.cantidad, 0),
    total: items.reduce((total, item) => total + item.producto.precio * item.cantidad, 0),
    addItem(producto, cantidad = 1) {
      setItems((current) => {
        const existing = current.find((item) => item.producto.id === producto.id);

        if (existing) {
          return current.map((item) =>
            item.producto.id === producto.id
              ? { ...item, cantidad: Math.min(item.cantidad + cantidad, MAX_CANTIDAD) }
              : item
          );
        }

        return [...current, { producto, cantidad: Math.min(cantidad, MAX_CANTIDAD), observaciones: "" }];
      });
    },
    setQuantity(productoId, cantidad) {
      setItems((current) => current.map((item) =>
        item.producto.id === productoId
          ? { ...item, cantidad: Math.min(Math.max(cantidad, 1), MAX_CANTIDAD) }
          : item
      ));
    },
    setObservations(productoId, observaciones) {
      setItems((current) => current.map((item) =>
        item.producto.id === productoId ? { ...item, observaciones } : item
      ));
    },
    removeItem(productoId) {
      setItems((current) => current.filter((item) => item.producto.id !== productoId));
    },
    clear() {
      setItems([]);
    }
  }), [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }

  return context;
}
