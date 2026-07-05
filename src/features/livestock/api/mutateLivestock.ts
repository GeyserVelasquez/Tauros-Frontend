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

/**
 * Traslada un animal individual a un potrero.
 */
export async function moveLivestockToPaddock(
  id: string | number,
  payload: { paddock_id: number; made_at: string }
): Promise<Livestock> {
  const { data } = await api.post<{ data: Livestock }>(`/livestock/${id}/move-paddock`, payload);
  return data.data;
}

/**
 * Traslada un animal individual a un lote.
 */
export async function moveLivestockToBatch(
  id: string | number,
  payload: { batch_id: number; made_at: string }
): Promise<Livestock> {
  const { data } = await api.post<{ data: Livestock }>(`/livestock/${id}/move-batch`, payload);
  return data.data;
}
