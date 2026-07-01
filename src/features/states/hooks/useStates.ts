import { useQuery } from "@tanstack/react-query";
import { getStates } from "../api/getStates";

export function useStates() {
  return useQuery({
    queryKey: ["states"],
    queryFn: getStates,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours caching for static dropdown values
  });
}
