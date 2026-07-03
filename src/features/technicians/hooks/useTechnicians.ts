import { useQuery } from "@tanstack/react-query";
import { getTechnicians } from "../api/getTechnicians";

export function useTechnicians() {
  return useQuery({
    queryKey: ["technicians"],
    queryFn: getTechnicians,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours caching for static dropdown values
  });
}
