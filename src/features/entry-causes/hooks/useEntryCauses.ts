import { useQuery } from "@tanstack/react-query";
import { getEntryCauses } from "../api/getEntryCauses";

export function useEntryCauses() {
  return useQuery({
    queryKey: ["entry-causes"],
    queryFn: getEntryCauses,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours caching for static dropdown values
  });
}
