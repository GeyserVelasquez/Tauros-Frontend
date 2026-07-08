import { api } from "@/lib/api";
import { PaginatedResponse } from "@/types";
import { TreatmentApplication } from "../types";

/**
 * Obtiene la lista de aplicaciones agendadas.
 */
export async function getTreatmentApplicationsList(params?: Record<string, any>): Promise<PaginatedResponse<TreatmentApplication>> {
  const { data } = await api.get<PaginatedResponse<TreatmentApplication>>("/treatment-applications", { params });
  return data;
}

/**
 * Registra la aplicación física real de la dosis.
 */
export async function applyTreatmentApplication(
  id: string | number,
  formData: { quantity_used: number; applied_by_id?: number | null }
): Promise<TreatmentApplication> {
  const { data } = await api.post<{ data: TreatmentApplication }>(`/treatment-applications/${id}/apply`, formData);
  return data.data;
}

/**
 * Revierte una dosis aplicada a estado pendiente.
 */
export async function unapplyTreatmentApplication(id: string | number): Promise<TreatmentApplication> {
  const { data } = await api.post<{ data: TreatmentApplication }>(`/treatment-applications/${id}/unapply`);
  return data.data;
}

/**
 * Elimina una aplicación de tratamiento agendada.
 */
export async function deleteTreatmentApplication(id: string | number): Promise<void> {
  await api.delete(`/treatment-applications/${id}`);
}
