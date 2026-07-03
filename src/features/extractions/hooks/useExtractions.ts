import { useQuery } from "@tanstack/react-query";
import { getExtractionsList, getExtractionTypes } from "../api";

export function useExtractionsList(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["extractions", "list", params],
    queryFn: () => getExtractionsList(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useExtractionTypes() {
  return useQuery({
    queryKey: ["extractions", "types"],
    queryFn: getExtractionTypes,
    staleTime: 30 * 60 * 1000,
  });
}
