import { useQuery } from "@tanstack/react-query";
import { getRevisionsList, getRevisionTypes } from "../api";

export function useRevisionsList(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["revisions", "list", params],
    queryFn: () => getRevisionsList(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useRevisionTypes() {
  return useQuery({
    queryKey: ["revisions", "types"],
    queryFn: getRevisionTypes,
    staleTime: 30 * 60 * 1000,
  });
}
