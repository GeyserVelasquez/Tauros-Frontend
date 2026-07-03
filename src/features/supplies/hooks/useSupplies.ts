import { useQuery } from "@tanstack/react-query";
import { getSupplies } from "../api/getSupplies";

export function useSupplies() {
  return useQuery({
    queryKey: ["supplies"],
    queryFn: getSupplies,
    staleTime: 10 * 60 * 1000, // 10 minutes cache
  });
}
