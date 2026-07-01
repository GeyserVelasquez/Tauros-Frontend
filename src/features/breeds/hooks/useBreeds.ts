import { useQuery } from "@tanstack/react-query";
import { getBreeds } from "../api/getBreeds";

export function useBreeds() {
  return useQuery({
    queryKey: ["breeds"],
    queryFn: getBreeds,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours caching for static dropdown values
  });
}
