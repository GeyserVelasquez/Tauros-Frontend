import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createPaddock, updatePaddock, deletePaddock } from "../api/mutatePaddocks";

export function useCreatePaddock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPaddock,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["paddocks"] });
      toast.success(`Potrero registrado exitosamente: ${data.name}`);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al registrar el potrero. Inténtalo de nuevo.";
      toast.error(message);
    },
  });
}

export function useUpdatePaddock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }: { id: string | number; formData: any }) => updatePaddock(id, formData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["paddocks"] });
      toast.success(`Potrero ${data.name} actualizado correctamente.`);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al actualizar el potrero. Inténtalo de nuevo.";
      toast.error(message);
    },
  });
}

export function useDeletePaddock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePaddock,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paddocks"] });
      toast.success("Potrero eliminado exitosamente.");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al eliminar el potrero.";
      toast.error(message);
    },
  });
}
