import { api } from "@/lib/api";
import { PaginatedResponse } from "@/types";
import { ClinicDiagnostic } from "../types";

/**
 * Obtiene la lista paginada de diagnósticos clínicos.
 */
export async function getClinicDiagnosticsList(params?: Record<string, any>): Promise<PaginatedResponse<ClinicDiagnostic>> {
  const { data } = await api.get<PaginatedResponse<ClinicDiagnostic>>("/clinic-diagnostics", { params });
  return data;
}

/**
 * Obtiene los detalles de un diagnóstico clínico por ID.
 */
export async function getClinicDiagnosticById(id: string | number, params?: { include?: string }): Promise<ClinicDiagnostic> {
  const { data } = await api.get<{ data: ClinicDiagnostic }>(`/clinic-diagnostics/${id}`, { params });
  return data.data;
}

/**
 * Registra un nuevo diagnóstico clínico.
 */
export async function createClinicDiagnostic(formData: { code: string; name: string; attributes: Record<string, string> }): Promise<ClinicDiagnostic> {
  const { data } = await api.post<{ data: ClinicDiagnostic }>("/clinic-diagnostics", formData);
  return data.data;
}

/**
 * Actualiza un diagnóstico clínico existente.
 */
export async function updateClinicDiagnostic({ id, formData }: { id: string | number; formData: { code: string; name: string; attributes: Record<string, string> } }): Promise<ClinicDiagnostic> {
  const { data } = await api.put<{ data: ClinicDiagnostic }>(`/clinic-diagnostics/${id}`, formData);
  return data.data;
}

/**
 * Elimina un diagnóstico clínico (Soft Delete).
 */
export async function deleteClinicDiagnostic(id: string | number): Promise<void> {
  await api.delete(`/clinic-diagnostics/${id}`);
}
