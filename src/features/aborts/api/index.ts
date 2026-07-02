import { api } from "@/lib/api";
import { PaginatedResponse } from "@/types";
import { Abort, AbortType, AbortFormData } from "../types";

/**
 * Obtiene la lista paginada de abortos registrados.
 */
export async function getAbortsList(params?: Record<string, any>): Promise<PaginatedResponse<Abort>> {
  const { data } = await api.get<PaginatedResponse<Abort>>("/aborts", { params });
  return data;
}

/**
 * Obtiene los detalles de un aborto por ID.
 */
export async function getAbortById(id: string | number, params?: { include?: string }): Promise<Abort> {
  const { data } = await api.get<{ data: Abort }>(`/aborts/${id}`, { params });
  return data.data;
}

/**
 * Obtiene los tipos de abortos del catálogo.
 */
export async function getAbortTypes(): Promise<AbortType[]> {
  const { data } = await api.get<{ data: AbortType[] }>("/abort-types");
  return data.data;
}



/**
 * Registra un nuevo evento de aborto.
 */
export async function createAbort(formData: AbortFormData): Promise<Abort> {
  const { data } = await api.post<{ data: Abort }>("/aborts", formData);
  return data.data;
}

/**
 * Actualiza un aborto existente.
 */
export async function updateAbort({ id, formData }: { id: string | number; formData: AbortFormData }): Promise<Abort> {
  const { data } = await api.put<{ data: Abort }>(`/aborts/${id}`, formData);
  return data.data;
}

/**
 * Elimina un registro de aborto (Soft Delete).
 */
export async function deleteAbort(id: string | number): Promise<void> {
  await api.delete(`/aborts/${id}`);
}
