const HORA_APERTURA = 8;
const HORA_CIERRE = 17;
const ANTICIPACION_MINUTOS = 15;
const INTERVALO_MINUTOS = 15;

// Genera los horarios de retiro disponibles para hoy: entre la apertura y
// 15 minutos antes del cierre, con al menos 15 minutos de anticipación.
export function getPickupSlots(now = new Date()) {
  const slots = [];
  const first = new Date(Math.max(
    now.getTime() + ANTICIPACION_MINUTOS * 60 * 1000,
    new Date(now).setHours(HORA_APERTURA, 0, 0, 0)
  ));

  // Redondea hacia arriba al próximo intervalo de 15 minutos.
  first.setMinutes(Math.ceil(first.getMinutes() / INTERVALO_MINUTOS) * INTERVALO_MINUTOS, 0, 0);

  const last = new Date(now);
  last.setHours(HORA_CIERRE, -ANTICIPACION_MINUTOS, 0, 0);

  for (const slot = new Date(first); slot <= last; slot.setMinutes(slot.getMinutes() + INTERVALO_MINUTOS)) {
    slots.push(slot.toTimeString().slice(0, 5));
  }

  return slots;
}

export const formatTime = (value) =>
  new Date(value).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false });

export const formatDate = (value) =>
  new Date(value).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });
