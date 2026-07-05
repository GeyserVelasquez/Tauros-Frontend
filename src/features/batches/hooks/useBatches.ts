import { useQuery } from "@tanstack/react-query";
import { getBatchList, getBatchById } from "../api/getBatches";

export function useBatchList(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["batches", "list", params],
    queryFn: () => getBatchList(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useBatchById(id: string | number, params?: Record<string, any>) {
  return useQuery({
    queryKey: ["batches", "detail", id, params],
    queryFn: () => getBatchById(id, params),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}
