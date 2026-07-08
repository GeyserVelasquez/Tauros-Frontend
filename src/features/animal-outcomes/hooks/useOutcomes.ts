import { useQuery } from "@tanstack/react-query";
import { getAnimalOutcomes, getDeathCauses } from "../api";

export function useAnimalOutcomesList(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["animal-outcomes", "list", params],
    queryFn: () => getAnimalOutcomes(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useDeathCauses() {
  return useQuery({
    queryKey: ["death-causes", "list"],
    queryFn: getDeathCauses,
    staleTime: 30 * 60 * 1000,
  });
}
