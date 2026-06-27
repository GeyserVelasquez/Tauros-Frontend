import { api } from "@/lib/api";
import { PaginatedResponse } from "@/types";
import { Livestock } from "../types";

/**
 * Obtiene la lista paginada de ganado desde el backend.
 * Soporta parámetros adicionales (ej. filtros por sexo, búsqueda o carga de relaciones).
 */
export async function getLivestockList(params?: Record<string, any>): Promise<PaginatedResponse<Livestock>> {
  const { data } = await api.get<PaginatedResponse<Livestock>>("/livestock", { params });
  return data;
}

/**
 * Obtiene los detalles de un único animal a partir de su ID.
 */
export async function getLivestockById(id: string | number, params?: { include?: string }): Promise<Livestock> {
  const { data } = await api.get<{ data: Livestock }>(`/livestock/${id}`, { params });
  return data.data;
}
