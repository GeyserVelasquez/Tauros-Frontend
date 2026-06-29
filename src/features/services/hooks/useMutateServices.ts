import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createService, updateService, deleteService } from "../api/mutateServices";

/**
 * Hook para registrar un nuevo servicio reproductivo.
 */
export function useCreateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createService,
    onSuccess: () => {
      // Invalidar caché de servicios y de ganado para actualizar historial reproductivo del animal
      queryClient.invalidateQueries({ queryKey: ["services"] });
      queryClient.invalidateQueries({ queryKey: ["livestock"] });
      toast.success("Servicio reproductivo registrado exitosamente.");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al registrar el servicio. Inténtelo de nuevo.";
      console.error(message);
      toast.error(message);
    },
  });
}

/**
 * Hook para actualizar un servicio reproductivo existente.
 */
export function useUpdateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      queryClient.invalidateQueries({ queryKey: ["livestock"] });
      toast.success("Servicio reproductivo actualizado correctamente.");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al actualizar el servicio. Inténtelo de nuevo.";
      console.error(message);
      toast.error(message);
    },
  });
}

/**
 * Hook para eliminar un servicio reproductivo.
 */
export function useDeleteService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      queryClient.invalidateQueries({ queryKey: ["livestock"] });
      toast.success("Servicio reproductivo eliminado exitosamente.");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al eliminar el servicio.";
      console.error(message);
      toast.error(message);
    },
  });
}
