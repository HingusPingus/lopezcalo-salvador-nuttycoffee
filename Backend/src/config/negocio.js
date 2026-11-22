// Horario de atención del local. Configurable por entorno para facilitar pruebas.
export const HORA_APERTURA = Number(process.env.HORA_APERTURA ?? 8);
export const HORA_CIERRE = Number(process.env.HORA_CIERRE ?? 17);
export const MINUTOS_ANTICIPACION = 15;
export const MINUTOS_TOLERANCIA_RETIRO = 30;
export const MAX_PEDIDOS_ACTIVOS = 2;
export const MAX_NO_RETIRADOS = 3;
export const MAX_CANTIDAD_POR_PRODUCTO = 20;
export const OBSERVACIONES_MAX = 200;
