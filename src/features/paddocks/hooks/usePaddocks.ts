import { useQuery } from "@tanstack/react-query";
import { getPaddockList, getPaddockById } from "../api/getPaddocks";

export function usePaddockList(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["paddocks", "list", params],
    queryFn: () => getPaddockList(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function usePaddockById(id: string | number, params?: Record<string, any>) {
  return useQuery({
    queryKey: ["paddocks", "detail", id, params],
    queryFn: () => getPaddockById(id, params),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}
