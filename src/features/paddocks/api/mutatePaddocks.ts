import { api } from "@/lib/api";
import { Paddock, PaddockFormData } from "../types";

export async function createPaddock(formData: PaddockFormData): Promise<Paddock> {
  const { data } = await api.post<{ data: Paddock }>("/paddocks", formData);
  return data.data;
}

export async function updatePaddock(id: string | number, formData: PaddockFormData): Promise<Paddock> {
  const { data } = await api.put<{ data: Paddock }>(`/paddocks/${id}`, formData);
  return data.data;
}

export async function deletePaddock(id: string | number): Promise<void> {
  await api.delete(`/paddocks/${id}`);
}
