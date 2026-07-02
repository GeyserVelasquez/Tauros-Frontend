import { useQuery } from "@tanstack/react-query";
import { getAbortsList, getAbortTypes } from "../api";

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
