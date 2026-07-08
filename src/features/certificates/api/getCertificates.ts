import { api } from "@/lib/api";
import { PaginatedResponse } from "@/types";
import { Certificate } from "../types";

export async function getCertificateList(params?: Record<string, any>): Promise<PaginatedResponse<Certificate>> {
  const { data } = await api.get<PaginatedResponse<Certificate>>("/certificates", { params });
  return data;
}

export async function getCertificateById(id: string | number, params?: Record<string, any>): Promise<Certificate> {
  const { data } = await api.get<{ data: Certificate }>(`/certificates/${id}`, { params });
  return data.data;
}
