import { useQuery } from "@tanstack/react-query";
import { getMilkingsList, getMilkingTypes } from "../api";

export function useMilkingsList(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["milkings", "list", params],
    queryFn: () => getMilkingsList(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useMilkingTypes() {
  return useQuery({
    queryKey: ["milkings", "types"],
    queryFn: getMilkingTypes,
    staleTime: 30 * 60 * 1000,
  });
}
