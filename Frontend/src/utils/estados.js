export const ESTADOS = Object.freeze({
  PENDIENTE: { label: "Pendiente", tone: "pending" },
  CONFIRMADO: { label: "Confirmado", tone: "info" },
  EN_PREPARACION: { label: "En preparación", tone: "info" },
  LISTO_PARA_RETIRAR: { label: "Listo para retirar", tone: "ready" },
  ENTREGADO: { label: "Entregado", tone: "done" },
  CANCELADO: { label: "Cancelado", tone: "off" },
  RECHAZADO: { label: "Rechazado", tone: "off" },
  NO_RETIRADO: { label: "No retirado", tone: "off" }
});

// Acciones que puede ejecutar el personal del local según el estado actual.
export const ACCIONES_PANEL = Object.freeze({
  PENDIENTE: [
    { estado: "CONFIRMADO", label: "Confirmar", variant: "primary" },
    { estado: "RECHAZADO", label: "Rechazar", variant: "danger" }
  ],
  CONFIRMADO: [{ estado: "EN_PREPARACION", label: "En preparación", variant: "primary" }],
  EN_PREPARACION: [{ estado: "LISTO_PARA_RETIRAR", label: "Listo para retirar", variant: "primary" }],
  LISTO_PARA_RETIRAR: [
    { estado: "ENTREGADO", label: "Entregado", variant: "primary" },
    { estado: "NO_RETIRADO", label: "No retirado", variant: "danger" }
  ]
});

export const PUEDE_CANCELAR = ["PENDIENTE", "CONFIRMADO"];
