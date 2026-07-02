import { api } from "@/lib/api";
import { PaginatedResponse } from "@/types";
import { ClinicalTreatment } from "../types";

/**
 * Obtiene la lista paginada de tratamientos clínicos.
 */
export async function getClinicalTreatmentsList(params?: Record<string, any>): Promise<PaginatedResponse<ClinicalTreatment>> {
  const { data } = await api.get<PaginatedResponse<ClinicalTreatment>>("/clinical-treatments", { params });
  return data;
}

/**
 * Obtiene los detalles de un tratamiento clínico por ID.
 */
export async function getClinicalTreatmentById(id: string | number, params?: { include?: string }): Promise<ClinicalTreatment> {
  const { data } = await api.get<{ data: ClinicalTreatment }>(`/clinical-treatments/${id}`, { params });
  return data.data;
}

/**
 * Registra un nuevo tratamiento clínico.
 */
export async function createClinicalTreatment(formData: { code: string; name: string; attributes: Record<string, string> }): Promise<ClinicalTreatment> {
  const { data } = await api.post<{ data: ClinicalTreatment }>("/clinical-treatments", formData);
  return data.data;
}

/**
 * Actualiza un tratamiento clínico existente.
 */
export async function updateClinicalTreatment({ id, formData }: { id: string | number; formData: { code: string; name: string; attributes: Record<string, string> } }): Promise<ClinicalTreatment> {
  const { data } = await api.put<{ data: ClinicalTreatment }>(`/clinical-treatments/${id}`, formData);
  return data.data;
}

/**
 * Elimina un tratamiento clínico (Soft Delete).
 */
export async function deleteClinicalTreatment(id: string | number): Promise<void> {
  await api.delete(`/clinical-treatments/${id}`);
}
