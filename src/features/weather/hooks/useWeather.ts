import { useQuery } from "@tanstack/react-query";
import { getWeather } from "../api/get-weather";

/**
 * Hook de React Query para acceder y compartir el estado del clima en la app.
 * Configura caché de 10 minutos óptimo para conexiones rurales.
 */
export function useWeather() {
  return useQuery({
    queryKey: ["weather", "data"],
    queryFn: getWeather,
    staleTime: 10 * 60 * 1000, // 10 minutos de caché
    refetchOnWindowFocus: false, // Evita llamadas innecesarias al cambiar de pestaña
  });
}
