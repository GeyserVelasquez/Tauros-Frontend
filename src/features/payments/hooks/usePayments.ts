import { useQuery } from "@tanstack/react-query"
import { getPayments } from "../api/getPayments"

export function usePayments() {
  return useQuery({
    queryKey: ["payments"],
    queryFn: getPayments,
    staleTime: 5 * 60 * 1000,
  })
}
