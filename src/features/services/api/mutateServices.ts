import { api } from "@/lib/api";
import { Service, ServiceFormData } from "../types";

/**
 * Registra un nuevo servicio reproductivo en el backend.
 */
export async function createService(formData: ServiceFormData): Promise<Service> {
  console.log(formData);
  const { data } = await api.post<{ data: Service }>("/services", formData);
  return data.data;
}

/**
 * Actualiza un registro de servicio reproductivo existente.
 */
export async function updateService({ id, formData }: { id: string | number; formData: ServiceFormData }): Promise<Service> {
  const { data } = await api.put<{ data: Service }>(`/services/${id}`, formData);
  return data.data;
}

/**
 * Elimina un registro de servicio reproductivo (Soft Delete en backend).
 */
export async function deleteService(id: string | number): Promise<void> {
  await api.delete(`/services/${id}`);
}
