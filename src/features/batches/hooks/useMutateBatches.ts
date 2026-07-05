import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createBatch, updateBatch, deleteBatch, moveBatchToPaddock } from "../api/mutateBatches";

export function useCreateBatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBatch,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["batches"] });
      toast.success(`Lote registrado exitosamente: ${data.name}`);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al registrar el lote. Inténtalo de nuevo.";
      toast.error(message);
    },
  });
}

export function useUpdateBatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }: { id: string | number; formData: any }) => updateBatch(id, formData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["batches"] });
      toast.success(`Lote ${data.name} actualizado correctamente.`);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al actualizar el lote. Inténtalo de nuevo.";
      toast.error(message);
    },
  });
}

export function useDeleteBatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["batches"] });
      toast.success("Lote eliminado exitosamente.");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al eliminar el lote.";
      toast.error(message);
    },
  });
}

export function useMoveBatchToPaddock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, paddock_id, made_at }: { id: string | number; paddock_id: number; made_at: string }) =>
      moveBatchToPaddock(id, { paddock_id, made_at }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["batches"] });
      queryClient.invalidateQueries({ queryKey: ["livestock"] });
      toast.success(`Lote ${data.name} trasladado exitosamente.`);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al trasladar el lote. Inténtalo de nuevo.";
      toast.error(message);
    },
  });
}
