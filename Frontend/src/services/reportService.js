import { request } from "./api";

export const getSalesReport = () => request("/reportes/ventas");
