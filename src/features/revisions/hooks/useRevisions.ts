import { useQuery } from "@tanstack/react-query";
import { getRevisionsList, getRevisionTypes, getTechnicians } from "../api";

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

export function useTechniciansList() {
  return useQuery({
    queryKey: ["revisions", "technicians"],
    queryFn: getTechnicians,
    staleTime: 30 * 60 * 1000,
  });
}
