import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createRevision, updateRevision, deleteRevision } from "../api";

export function useCreateRevision() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRevision,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["revisions"] });
      queryClient.invalidateQueries({ queryKey: ["livestock"] });
      toast.success("Palpación registrada exitosamente.");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al registrar la palpación. Intente de nuevo.";
      toast.error(message);
    },
  });
}

export function useUpdateRevision() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateRevision,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["revisions"] });
      queryClient.invalidateQueries({ queryKey: ["livestock"] });
      toast.success("Palpación actualizada exitosamente.");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al actualizar la palpación. Intente de nuevo.";
      toast.error(message);
    },
  });
}

export function useDeleteRevision() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRevision,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["revisions"] });
      queryClient.invalidateQueries({ queryKey: ["livestock"] });
      toast.success("Registro de palpación eliminado.");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al eliminar la palpación. Intente de nuevo.";
      toast.error(message);
    },
  });
}
