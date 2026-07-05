import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getTreatmentApplicationsList,
  applyTreatmentApplication,
  unapplyTreatmentApplication,
  deleteTreatmentApplication,
} from "../api";

export function useTreatmentApplicationsList(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["treatment-applications", "list", params],
    queryFn: () => getTreatmentApplicationsList(params),
    staleTime: 2 * 60 * 1000, // lower staleTime for real-time agenda updates
  });
}

export function useApplyTreatmentApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }: { id: string | number; formData: { quantity_used: number; applied_by_id?: number | null } }) =>
      applyTreatmentApplication(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["treatment-applications"] });
      // Invalidate livestock and dashboard query caches if stock counts or health status depends on it
      queryClient.invalidateQueries({ queryKey: ["movement-kardex"] });
      queryClient.invalidateQueries({ queryKey: ["supplies"] });
      toast.success("Dosis marcada como aplicada exitosamente.");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al aplicar la dosis. Intente de nuevo.";
      toast.error(message);
    },
  });
}

export function useUnapplyTreatmentApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unapplyTreatmentApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["treatment-applications"] });
      queryClient.invalidateQueries({ queryKey: ["movement-kardex"] });
      queryClient.invalidateQueries({ queryKey: ["supplies"] });
      toast.success("Aplicación revertida a pendiente exitosamente.");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al revertir la dosis. Intente de nuevo.";
      toast.error(message);
    },
  });
}

export function useDeleteTreatmentApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTreatmentApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["treatment-applications"] });
      toast.success("Aplicación agendada eliminada exitosamente.");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al eliminar la dosis agendada. Intente de nuevo.";
      toast.error(message);
    },
  });
}
