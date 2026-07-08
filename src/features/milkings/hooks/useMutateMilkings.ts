import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createMilking, updateMilking, deleteMilking } from "../api";

export function useCreateMilking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMilking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["milkings"] });
      queryClient.invalidateQueries({ queryKey: ["livestock"] });
      toast.success("Ordeño registrado exitosamente.");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al registrar el ordeño. Intente de nuevo.";
      toast.error(message);
    },
  });
}

export function useUpdateMilking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMilking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["milkings"] });
      queryClient.invalidateQueries({ queryKey: ["livestock"] });
      toast.success("Ordeño actualizado exitosamente.");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al actualizar el ordeño. Intente de nuevo.";
      toast.error(message);
    },
  });
}

export function useDeleteMilking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMilking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["milkings"] });
      queryClient.invalidateQueries({ queryKey: ["livestock"] });
      toast.success("Registro de ordeño eliminado.");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al eliminar el ordeño. Intente de nuevo.";
      toast.error(message);
    },
  });
}
