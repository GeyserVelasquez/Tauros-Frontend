import { useQuery } from "@tanstack/react-query";
import { getGrowthsList, getGrowthTypes } from "../api";

export function useGrowthsList(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["growths", "list", params],
    queryFn: () => getGrowthsList(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useGrowthTypes() {
  return useQuery({
    queryKey: ["growths", "types"],
    queryFn: getGrowthTypes,
    staleTime: 30 * 60 * 1000,
  });
}
