import { api } from "@/lib/api";
import { Batch, BatchFormData } from "../types";

export async function createBatch(formData: BatchFormData): Promise<Batch> {
  const { data } = await api.post<{ data: Batch }>("/batches", formData);
  return data.data;
}

export async function updateBatch(id: string | number, formData: BatchFormData): Promise<Batch> {
  const { data } = await api.put<{ data: Batch }>(`/batches/${id}`, formData);
  return data.data;
}

export async function deleteBatch(id: string | number): Promise<void> {
  await api.delete(`/batches/${id}`);
}

export async function moveBatchToPaddock(
  id: string | number,
  payload: { paddock_id: number; made_at: string }
): Promise<Batch> {
  const { data } = await api.post<{ data: Batch }>(`/batches/${id}/move`, payload);
  return data.data;
}
