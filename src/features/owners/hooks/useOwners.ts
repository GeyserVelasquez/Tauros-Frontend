import { useQuery } from "@tanstack/react-query";
import { getOwners } from "../api/getOwners";

export function useOwners() {
  return useQuery({
    queryKey: ["owners"],
    queryFn: getOwners,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours caching for static dropdown values
  });
}
