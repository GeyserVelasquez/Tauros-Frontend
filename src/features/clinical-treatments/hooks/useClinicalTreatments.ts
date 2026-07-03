import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getClinicalTreatmentsList,
  createClinicalTreatment,
  updateClinicalTreatment,
  deleteClinicalTreatment,
} from "../api";

export function useClinicalTreatmentsList(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["clinical-treatments", "list", params],
    queryFn: () => getClinicalTreatmentsList(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateClinicalTreatment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createClinicalTreatment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clinical-treatments"] });
      toast.success("Tratamiento clínico registrado exitosamente.");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al registrar el tratamiento. Intente de nuevo.";
      toast.error(message);
    },
  });
}

export function useUpdateClinicalTreatment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateClinicalTreatment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clinical-treatments"] });
      toast.success("Tratamiento clínico actualizado exitosamente.");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al actualizar el tratamiento. Intente de nuevo.";
      toast.error(message);
    },
  });
}

export function useDeleteClinicalTreatment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteClinicalTreatment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clinical-treatments"] });
      toast.success("Tratamiento clínico eliminado exitosamente.");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al eliminar el tratamiento. Intente de nuevo.";
      toast.error(message);
    },
  });
}
