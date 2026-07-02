import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createExtraction, updateExtraction, deleteExtraction } from "../api";

export function useCreateExtraction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createExtraction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["extractions"] });
      queryClient.invalidateQueries({ queryKey: ["semen-batches"] });
      queryClient.invalidateQueries({ queryKey: ["embrion-batches"] });
      toast.success("Extracción registrada exitosamente.");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al registrar la extracción. Intente de nuevo.";
      toast.error(message);
    },
  });
}

export function useUpdateExtraction(id: string | number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: any) => updateExtraction({ id, formData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["extractions"] });
      queryClient.invalidateQueries({ queryKey: ["semen-batches"] });
      queryClient.invalidateQueries({ queryKey: ["embrion-batches"] });
      toast.success("Extracción actualizada exitosamente.");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al actualizar la extracción. Intente de nuevo.";
      toast.error(message);
    },
  });
}

export function useDeleteExtraction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteExtraction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["extractions"] });
      toast.success("Registro de extracción eliminado.");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al eliminar la extracción. Intente de nuevo.";
      toast.error(message);
    },
  });
}
