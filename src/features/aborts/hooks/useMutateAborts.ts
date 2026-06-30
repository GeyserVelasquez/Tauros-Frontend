import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createAbort, updateAbort, deleteAbort } from "../api";

export function useCreateAbort() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAbort,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aborts"] });
      queryClient.invalidateQueries({ queryKey: ["livestock"] });
      toast.success("Aborto registrado exitosamente.");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al registrar el aborto. Intente de nuevo.";
      toast.error(message);
    },
  });
}

export function useUpdateAbort() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAbort,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aborts"] });
      queryClient.invalidateQueries({ queryKey: ["livestock"] });
      toast.success("Aborto actualizado exitosamente.");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al actualizar el aborto. Intente de nuevo.";
      toast.error(message);
    },
  });
}

export function useDeleteAbort() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAbort,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aborts"] });
      queryClient.invalidateQueries({ queryKey: ["livestock"] });
      toast.success("Registro de aborto eliminado.");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al eliminar el aborto. Intente de nuevo.";
      toast.error(message);
    },
  });
}
