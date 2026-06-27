import { api } from "@/lib/api";
import { Livestock, LivestockFormData } from "../types";

/**
 * Crea un nuevo registro de ganado.
 */
export async function createLivestock(formData: LivestockFormData): Promise<Livestock> {
  const { data } = await api.post<{ data: Livestock }>("/livestock", formData);
  return data.data;
}

/**
 * Actualiza un registro de ganado existente.
 */
export async function updateLivestock({ id, formData }: { id: string | number; formData: LivestockFormData }): Promise<Livestock> {
  const { data } = await api.put<{ data: Livestock }>(`/livestock/${id}`, formData);
  return data.data;
}

/**
 * Elimina un registro de ganado.
 */
export async function deleteLivestock(id: string | number): Promise<void> {
  await api.delete(`/livestock/${id}`);
}
