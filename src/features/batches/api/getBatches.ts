import { api } from "@/lib/api";
import { PaginatedResponse } from "@/types";
import { Batch } from "../types";

export async function getBatchList(params?: Record<string, any>): Promise<PaginatedResponse<Batch>> {
  const { data } = await api.get<PaginatedResponse<Batch>>("/batches", { params });
  return data;
}

export async function getBatchById(id: string | number, params?: Record<string, any>): Promise<Batch> {
  const { data } = await api.get<{ data: Batch }>(`/batches/${id}`, { params });
  return data.data;
}
