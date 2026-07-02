import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getClinicDiagnosticsList,
  createClinicDiagnostic,
  updateClinicDiagnostic,
  deleteClinicDiagnostic,
} from "../api";

export function useClinicDiagnosticsList(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["clinic-diagnostics", "list", params],
    queryFn: () => getClinicDiagnosticsList(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateClinicDiagnostic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createClinicDiagnostic,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clinic-diagnostics"] });
      toast.success("Diagnóstico clínico registrado exitosamente.");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al registrar el diagnóstico. Intente de nuevo.";
      toast.error(message);
    },
  });
}

export function useUpdateClinicDiagnostic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateClinicDiagnostic,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clinic-diagnostics"] });
      toast.success("Diagnóstico clínico actualizado exitosamente.");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al actualizar el diagnóstico. Intente de nuevo.";
      toast.error(message);
    },
  });
}

export function useDeleteClinicDiagnostic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteClinicDiagnostic,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clinic-diagnostics"] });
      toast.success("Diagnóstico clínico eliminado exitosamente.");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al eliminar el diagnóstico. Intente de nuevo.";
      toast.error(message);
    },
  });
}
