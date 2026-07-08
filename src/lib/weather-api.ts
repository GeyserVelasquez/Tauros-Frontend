import axios from "axios";

/**
 * Cliente Axios dedicado exclusivamente para consultar rutas de la API local de Next.js.
 * Esto evita el uso de los interceptores del backend de Laravel que causan conflictos de autenticación.
 */
export const weatherApi = axios.create({
  baseURL: "/",
});
