import { useQuery } from "@tanstack/react-query";
import { getColors } from "../api/getColors";

export function useColors() {
  return useQuery({
    queryKey: ["colors"],
    queryFn: getColors,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours caching for static dropdown values
  });
}
