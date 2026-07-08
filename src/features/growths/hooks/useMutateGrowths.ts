import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createGrowth, updateGrowth, deleteGrowth } from "../api";

export function useCreateGrowth() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createGrowth,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["growths"] });
      queryClient.invalidateQueries({ queryKey: ["livestock"] });
      toast.success("Pesaje/Crecimiento registrado exitosamente.");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al registrar el pesaje/crecimiento. Intente de nuevo.";
      toast.error(message);
    },
  });
}

export function useUpdateGrowth() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateGrowth,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["growths"] });
      queryClient.invalidateQueries({ queryKey: ["livestock"] });
      toast.success("Pesaje/Crecimiento actualizado exitosamente.");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al actualizar el pesaje/crecimiento. Intente de nuevo.";
      toast.error(message);
    },
  });
}

export function useDeleteGrowth() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteGrowth,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["growths"] });
      queryClient.invalidateQueries({ queryKey: ["livestock"] });
      toast.success("Registro de pesaje/crecimiento eliminado.");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al eliminar el pesaje/crecimiento. Intente de nuevo.";
      toast.error(message);
    },
  });
}
