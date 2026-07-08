import { api } from "@/lib/api";
import { PaginatedResponse } from "@/types";
import { ClinicHistory, ClinicHistoryFormData } from "../types";

/**
 * Obtiene la lista paginada de historias clínicas.
 */
export async function getClinicHistoriesList(params?: Record<string, any>): Promise<PaginatedResponse<ClinicHistory>> {
  const { data } = await api.get<PaginatedResponse<ClinicHistory>>("/clinic-histories", { params });
  return data;
}

/**
 * Obtiene los detalles de una historia clínica por ID.
 */
export async function getClinicHistoryById(id: string | number, params?: { include?: string }): Promise<ClinicHistory> {
  const { data } = await api.get<{ data: ClinicHistory }>(`/clinic-histories/${id}`, { params });
  return data.data;
}

/**
 * Registra una nueva historia clínica (calculando dosis programadas en el backend).
 */
export async function createClinicHistory(formData: ClinicHistoryFormData): Promise<ClinicHistory> {
  const { data } = await api.post<{ data: ClinicHistory }>("/clinic-histories", formData);
  return data.data;
}

/**
 * Actualiza una historia clínica existente.
 */
export async function updateClinicHistory({ id, formData }: { id: string | number; formData: ClinicHistoryFormData }): Promise<ClinicHistory> {
  const { data } = await api.put<{ data: ClinicHistory }>(`/clinic-histories/${id}`, formData);
  return data.data;
}

/**
 * Elimina una historia clínica (Soft Delete).
 */
export async function deleteClinicHistory(id: string | number): Promise<void> {
  await api.delete(`/clinic-histories/${id}`);
}
