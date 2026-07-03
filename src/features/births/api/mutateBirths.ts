import { api } from "@/lib/api";
import { Birth, BirthFormData, BirthWizardData } from "../types";

export async function createBirth(formData: BirthWizardData): Promise<Birth> {
  const { data } = await api.post<{ data: Birth }>("/births", formData);
  return data.data;
}

export async function updateBirth({ id, formData }: { id: number; formData: BirthFormData }): Promise<Birth> {
  const { data } = await api.put<{ data: Birth }>(`/births/${id}`, formData);
  return data.data;
}

export async function deleteBirth(id: number): Promise<void> {
  await api.delete(`/births/${id}`);
}
