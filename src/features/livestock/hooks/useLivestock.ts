import { useQuery } from "@tanstack/react-query";
import { getLivestockList, getLivestockById } from "../api/getLivestock";

/**
 * Hook para obtener la lista paginada de ganado.
 */
export function useLivestockList(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["livestock", "list", params],
    queryFn: () => getLivestockList(params),
    staleTime: 5 * 60 * 1000, // Carga en caché durante 5 minutos
  });
}

/**
 * Hook para obtener un animal individual por ID.
 */
export function useLivestockById(id: string | number, params?: { include?: string }) {
  return useQuery({
    queryKey: ["livestock", "detail", id, params],
    queryFn: () => getLivestockById(id, params),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}
