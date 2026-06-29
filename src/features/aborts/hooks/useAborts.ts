import { useQuery } from "@tanstack/react-query";
import { getAbortsList, getAbortTypes, getTechnicians } from "../api";

export function useAbortsList(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["aborts", "list", params],
    queryFn: () => getAbortsList(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useAbortTypes() {
  return useQuery({
    queryKey: ["aborts", "types"],
    queryFn: getAbortTypes,
    staleTime: 30 * 60 * 1000,
  });
}

export function useTechniciansList() {
  return useQuery({
    queryKey: ["aborts", "technicians"],
    queryFn: getTechnicians,
    staleTime: 30 * 60 * 1000,
  });
}
