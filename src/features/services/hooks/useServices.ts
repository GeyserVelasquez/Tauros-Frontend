import { useQuery } from "@tanstack/react-query";
import {
  getServicesList,
  getServiceById,
  getServiceTypes,
  getSemenBatches,
  getEmbrionBatches,
  getTechnicians,
} from "../api/getServices";

/**
 * Hook para obtener el listado paginado y filtrado de servicios.
 */
export function useServicesList(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["services", "list", params],
    queryFn: () => getServicesList(params),
    staleTime: 5 * 60 * 1000, // Caché de 5 minutos
  });
}

/**
 * Hook para obtener un servicio individual por su ID.
 */
export function useServiceById(id: string | number, params?: { include?: string }) {
  return useQuery({
    queryKey: ["services", "detail", id, params],
    queryFn: () => getServiceById(id, params),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook para obtener los tipos de servicio disponibles.
 */
export function useServiceTypes() {
  return useQuery({
    queryKey: ["service-types"],
    queryFn: getServiceTypes,
    staleTime: 24 * 60 * 60 * 1000, // Catálogo estático: caché de 24 horas
  });
}

/**
 * Hook para obtener los lotes de semen disponibles.
 */
export function useSemenBatches() {
  return useQuery({
    queryKey: ["semen-batches"],
    queryFn: getSemenBatches,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook para obtener los lotes de embriones disponibles.
 */
export function useEmbrionBatches() {
  return useQuery({
    queryKey: ["embrion-batches"],
    queryFn: getEmbrionBatches,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook para obtener la lista de veterinarios y técnicos.
 */
export function useTechniciansList() {
  return useQuery({
    queryKey: ["technicians-list"],
    queryFn: getTechnicians,
    staleTime: 24 * 60 * 60 * 1000, // Catálogo estático: caché de 24 horas
  });
}
