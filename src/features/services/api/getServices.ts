import { api } from "@/lib/api";
import { PaginatedResponse } from "@/types";
import { Service, ServiceType, SemenBatch, EmbrionBatch, Technician } from "../types";

/**
 * Obtiene la lista paginada de servicios reproductivos desde el backend.
 * Soporta filtros y relaciones a incluir (ej. ?include=female,technician,serviceType,parentable).
 */
export async function getServicesList(params?: Record<string, any>): Promise<PaginatedResponse<Service>> {
  const { data } = await api.get<PaginatedResponse<Service>>("/services", { params });
  return data;
}

/**
 * Obtiene los detalles de un único servicio reproductivo por su ID.
 */
export async function getServiceById(id: string | number, params?: { include?: string }): Promise<Service> {
  const { data } = await api.get<{ data: Service }>(`/services/${id}`, { params });
  return data.data;
}

/**
 * Obtiene todos los tipos de servicios reproductivos.
 */
export async function getServiceTypes(): Promise<ServiceType[]> {
  const { data } = await api.get<{ data: ServiceType[] }>("/service-types");
  return data.data;
}

/**
 * Obtiene todos los lotes de semen disponibles.
 */
export async function getSemenBatches(): Promise<SemenBatch[]> {
  const { data } = await api.get<{ data: SemenBatch[] }>("/semen-batches");
  return data.data;
}

/**
 * Obtiene todos los lotes de embriones disponibles.
 */
export async function getEmbrionBatches(): Promise<EmbrionBatch[]> {
  const { data } = await api.get<{ data: EmbrionBatch[] }>("/embrion-batches");
  return data.data;
}

/**
 * Obtiene todos los veterinarios o técnicos.
 */
export async function getTechnicians(): Promise<Technician[]> {
  const { data } = await api.get<{ data: Technician[] }>("/technicians");
  return data.data;
}
