import { api } from "@/lib/api";
import { PaginatedResponse } from "@/types";
import { Revision, RevisionType, RevisionFormData } from "../types";

/**
 * Obtiene la lista paginada de palpaciones/revisiones.
 */
export async function getRevisionsList(params?: Record<string, any>): Promise<PaginatedResponse<Revision>> {
  const { data } = await api.get<PaginatedResponse<Revision>>("/revisions", { params });
  return data;
}

/**
 * Obtiene los detalles de una revisión por ID.
 */
export async function getRevisionById(id: string | number, params?: { include?: string }): Promise<Revision> {
  const { data } = await api.get<{ data: Revision }>(`/revisions/${id}`, { params });
  return data.data;
}

/**
 * Obtiene los tipos de revisión disponibles en el catálogo del backend.
 */
export async function getRevisionTypes(): Promise<RevisionType[]> {
  const { data } = await api.get<{ data: RevisionType[] }>("/revision-types");
  return data.data;
}



/**
 * Registra una nueva revisión/palpación.
 */
export async function createRevision(formData: RevisionFormData): Promise<Revision> {
  const { data } = await api.post<{ data: Revision }>("/revisions", formData);
  return data.data;
}

/**
 * Actualiza una revisión existente.
 */
export async function updateRevision({ id, formData }: { id: string | number; formData: RevisionFormData }): Promise<Revision> {
  const { data } = await api.put<{ data: Revision }>(`/revisions/${id}`, formData);
  return data.data;
}

/**
 * Elimina una revisión (Soft Delete).
 */
export async function deleteRevision(id: string | number): Promise<void> {
  await api.delete(`/revisions/${id}`);
}
