import { useQuery } from "@tanstack/react-query";
import { getClassifications } from "../api/getClassifications";

export function useClassifications() {
  return useQuery({
    queryKey: ["classifications"],
    queryFn: getClassifications,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours caching for static dropdown values
  });
}
