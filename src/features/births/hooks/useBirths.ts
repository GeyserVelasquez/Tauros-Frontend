import { useQuery } from "@tanstack/react-query";
import { getBirthsList, getBirthById, getBirthTypes, getNewbornTypes } from "../api/getBirths";

export function useBirthsList(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["births", "list", params],
    queryFn: () => getBirthsList(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useBirthById(id: string | number, params?: { include?: string }) {
  return useQuery({
    queryKey: ["births", "detail", id, params],
    queryFn: () => getBirthById(id, params),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useBirthTypes() {
  return useQuery({
    queryKey: ["birth-types"],
    queryFn: getBirthTypes,
    staleTime: 24 * 60 * 60 * 1000,
  });
}

export function useNewbornTypes() {
  return useQuery({
    queryKey: ["newborn-types"],
    queryFn: getNewbornTypes,
    staleTime: 24 * 60 * 60 * 1000,
  });
}
