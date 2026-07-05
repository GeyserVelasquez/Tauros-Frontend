import { api } from "@/lib/api";
import { PaginatedResponse } from "@/types";
import { Paddock } from "../types";

export async function getPaddockList(params?: Record<string, any>): Promise<PaginatedResponse<Paddock>> {
  const { data } = await api.get<PaginatedResponse<Paddock>>("/paddocks", { params });
  return data;
}

export async function getPaddockById(id: string | number, params?: Record<string, any>): Promise<Paddock> {
  const { data } = await api.get<{ data: Paddock }>(`/paddocks/${id}`, { params });
  return data.data;
}
