import { request } from "./api";

export const getCategories = () => request("/categorias");
