import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createAnimalOutcome, deleteAnimalOutcome } from "../api";

export function useCreateAnimalOutcome() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAnimalOutcome,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["animal-outcomes"] });
      queryClient.invalidateQueries({ queryKey: ["livestock"] });
      toast.success("Salida de animal registrada exitosamente.");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al registrar la salida del animal.";
      toast.error(message);
    },
  });
}

export function useDeleteAnimalOutcome() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAnimalOutcome,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["animal-outcomes"] });
      queryClient.invalidateQueries({ queryKey: ["livestock"] });
      toast.success("Registro de salida eliminado. El animal ha sido reactivado.");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al revertir la salida del animal.";
      toast.error(message);
    },
  });
}
