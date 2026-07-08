import { useQuery } from "@tanstack/react-query";
import { getCertificateList, getCertificateById } from "../api/getCertificates";

export function useCertificateList(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["certificates", "list", params],
    queryFn: () => getCertificateList(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCertificateById(id: string | number, params?: Record<string, any>) {
  return useQuery({
    queryKey: ["certificates", "detail", id, params],
    queryFn: () => getCertificateById(id, params),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}
