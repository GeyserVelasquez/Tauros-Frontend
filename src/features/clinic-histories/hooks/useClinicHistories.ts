import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getClinicHistoriesList,
  getClinicHistoryById,
  createClinicHistory,
  updateClinicHistory,
  deleteClinicHistory,
} from "../api";

export function useClinicHistoriesList(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["clinic-histories", "list", params],
    queryFn: () => getClinicHistoriesList(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useClinicHistory(id: string | number, params?: { include?: string }) {
  return useQuery({
    queryKey: ["clinic-histories", "detail", id, params],
    queryFn: () => getClinicHistoryById(id, params),
    enabled: !!id,
  });
}

export function useCreateClinicHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createClinicHistory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clinic-histories"] });
      // Invalidate treatment applications since creating clinic history schedules new applications
      queryClient.invalidateQueries({ queryKey: ["treatment-applications"] });
      toast.success("Historia clínica registrada exitosamente.");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al registrar la historia clínica. Intente de nuevo.";
      toast.error(message);
    },
  });
}

export function useUpdateClinicHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateClinicHistory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clinic-histories"] });
      queryClient.invalidateQueries({ queryKey: ["treatment-applications"] });
      toast.success("Historia clínica actualizada exitosamente.");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al actualizar la historia clínica. Intente de nuevo.";
      toast.error(message);
    },
  });
}

export function useDeleteClinicHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteClinicHistory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clinic-histories"] });
      queryClient.invalidateQueries({ queryKey: ["treatment-applications"] });
      toast.success("Historia clínica eliminada exitosamente.");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al eliminar la historia clínica. Intente de nuevo.";
      toast.error(message);
    },
  });
}
