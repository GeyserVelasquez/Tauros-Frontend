import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "../api/get-stats";

/**
 * Hook para obtener las estadísticas consolidadas del dashboard.
 * Utiliza TanStack Query para almacenamiento en caché y manejo de estados.
 */
export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: getDashboardStats,
    staleTime: 5 * 60 * 1000, // Caché por 5 minutos para ahorrar datos en conexiones rurales
  });
}
