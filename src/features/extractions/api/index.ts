import { api } from "@/lib/api";
import { PaginatedResponse } from "@/types";
import { Extraction, LookupItem, ExtractionFormData } from "../types";

/**
 * Obtiene la lista paginada de extracciones registradas.
 */
export async function getExtractionsList(params?: Record<string, any>): Promise<PaginatedResponse<Extraction>> {
  const { data } = await api.get<PaginatedResponse<Extraction>>("/extractions", { params });
  return data;
}

/**
 * Obtiene los detalles de una extracción por ID.
 */
export async function getExtractionById(id: string | number, params?: { include?: string }): Promise<Extraction> {
  const { data } = await api.get<{ data: Extraction }>(`/extractions/${id}`, { params });
  return data.data;
}

/**
 * Obtiene los tipos de extracciones del catálogo.
 */
export async function getExtractionTypes(): Promise<LookupItem[]> {
  const { data } = await api.get<{ data: LookupItem[] }>("/extraction-types");
  return data.data;
}

/**
 * Registra una nueva extracción.
 */
export async function createExtraction(formData: ExtractionFormData): Promise<Extraction> {
  const { data } = await api.post<{ data: Extraction }>("/extractions", formData);
  return data.data;
}

/**
 * Actualiza una extracción existente.
 */
export async function updateExtraction({ id, formData }: { id: string | number; formData: ExtractionFormData }): Promise<Extraction> {
  const { data } = await api.put<{ data: Extraction }>(`/extractions/${id}`, formData);
  return data.data;
}

/**
 * Elimina una extracción (Soft Delete).
 */
export async function deleteExtraction(id: string | number): Promise<void> {
  await api.delete(`/extractions/${id}`);
}
