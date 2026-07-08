import { api } from "@/lib/api";
import { PaginatedResponse } from "@/types";
import { Milking, MilkingFormData, MilkingType } from "../types";

export async function getMilkingsList(params?: Record<string, any>): Promise<PaginatedResponse<Milking>> {
  const { data } = await api.get<PaginatedResponse<Milking>>("/milkings", { params });
  return data;
}

export async function getMilkingById(id: string | number, params?: { include?: string }): Promise<Milking> {
  const { data } = await api.get<{ data: Milking }>(`/milkings/${id}`, { params });
  return data.data;
}

export async function createMilking(formData: MilkingFormData): Promise<Milking> {
  const { data } = await api.post<{ data: Milking }>("/milkings", formData);
  return data.data;
}

export async function updateMilking({ id, formData }: { id: string | number; formData: MilkingFormData }): Promise<Milking> {
  const { data } = await api.put<{ data: Milking }>(`/milkings/${id}`, formData);
  return data.data;
}

export async function deleteMilking(id: string | number): Promise<void> {
  await api.delete(`/milkings/${id}`);
}

export async function getMilkingTypes(): Promise<MilkingType[]> {
  const { data } = await api.get<{ data: MilkingType[] }>("/milking-types");
  return data.data;
}
