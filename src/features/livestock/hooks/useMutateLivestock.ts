import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createLivestock, updateLivestock, deleteLivestock } from "../api/mutateLivestock";

/**
 * Hook para registrar un nuevo animal.
 */
export function useCreateLivestock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLivestock,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["livestock"] });
      toast.success(`Animal registrado exitosamente con marca: ${data.brand_number}`);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al registrar el animal. Inténtalo de nuevo.";
      console.error(message);
      toast.error(message);
    },
  });
}

/**
 * Hook para actualizar un animal existente.
 */
export function useUpdateLivestock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateLivestock,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["livestock"] });
      toast.success(`Animal ${data.brand_number} actualizado correctamente.`);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al actualizar el animal. Inténtalo de nuevo.";
      toast.error(message);
    },
  });
}

/**
 * Hook para eliminar un animal.
 */
export function useDeleteLivestock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLivestock,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["livestock"] });
      toast.success("Animal eliminado exitosamente.");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al eliminar el animal.";
      toast.error(message);
    },
  });
}
