import { api } from "@/lib/api";
import { PaginatedResponse } from "@/types";
import { Growth, GrowthFormData, GrowthType } from "../types";

export async function getGrowthsList(params?: Record<string, any>): Promise<PaginatedResponse<Growth>> {
  const { data } = await api.get<PaginatedResponse<Growth>>("/growths", { params });
  return data;
}

export async function getGrowthById(id: string | number, params?: { include?: string }): Promise<Growth> {
  const { data } = await api.get<{ data: Growth }>(`/growths/${id}`, { params });
  return data.data;
}

export async function createGrowth(formData: GrowthFormData): Promise<Growth> {
  const { data } = await api.post<{ data: Growth }>("/growths", formData);
  return data.data;
}

export async function updateGrowth({ id, formData }: { id: string | number; formData: GrowthFormData }): Promise<Growth> {
  const { data } = await api.put<{ data: Growth }>(`/growths/${id}`, formData);
  return data.data;
}

export async function deleteGrowth(id: string | number): Promise<void> {
  await api.delete(`/growths/${id}`);
}

export async function getGrowthTypes(): Promise<GrowthType[]> {
  const { data } = await api.get<{ data: GrowthType[] }>("/growth-types");
  return data.data;
}
