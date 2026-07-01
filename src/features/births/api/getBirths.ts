import { api } from "@/lib/api";
import { PaginatedResponse } from "@/types";
import { Birth, LookupItem } from "../types";

export async function getBirthsList(params?: Record<string, any>): Promise<PaginatedResponse<Birth>> {
  const { data } = await api.get<PaginatedResponse<Birth>>("/births", { params });
  return data;
}

export async function getBirthById(id: string | number, params?: { include?: string }): Promise<Birth> {
  const { data } = await api.get<{ data: Birth }>(`/births/${id}`, { params });
  return data.data;
}

export async function getBirthTypes(): Promise<LookupItem[]> {
  const { data } = await api.get<{ data: LookupItem[] }>("/birth-types");
  return data.data;
}

export async function getNewbornTypes(): Promise<LookupItem[]> {
  const { data } = await api.get<{ data: LookupItem[] }>("/newborn-types");
  return data.data;
}
