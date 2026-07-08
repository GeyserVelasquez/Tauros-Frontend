import { api } from "@/lib/api";
import { PaginatedResponse } from "@/types";
import { AnimalOutcome, DeathCause, OutcomeFormData } from "../types";

/**
 * Obtiene el listado paginado de salidas registradas.
 */
export async function getAnimalOutcomes(params?: Record<string, any>): Promise<PaginatedResponse<AnimalOutcome>> {
  const { data } = await api.get<PaginatedResponse<AnimalOutcome>>("/outcomes", { params });
  return data;
}

/**
 * Obtiene el catálogo de causas de muerte de la base de datos.
 */
export async function getDeathCauses(): Promise<DeathCause[]> {
  const { data } = await api.get<{ data: DeathCause[] }>("/death-causes");
  return data.data;
}

/**
 * Registra una nueva salida para un animal.
 */
export async function createAnimalOutcome(formData: OutcomeFormData): Promise<AnimalOutcome> {
  const { data } = await api.post<{ data: AnimalOutcome }>("/outcomes", formData);
  return data.data;
}

/**
 * Elimina un registro de salida (revirtiendo el estado del animal).
 */
export async function deleteAnimalOutcome(id: string | number): Promise<void> {
  await api.delete(`/outcomes/${id}`);
}
