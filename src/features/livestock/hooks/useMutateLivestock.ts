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
 * Implementa Optimistic Updates para mejorar la experiencia de usuario bajo redes rurales lentas.
 */
export function useDeleteLivestock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLivestock,
    onMutate: async (id: string | number) => {
      // Cancelar consultas salientes para evitar sobreescribir la actualización optimista
      await queryClient.cancelQueries({ queryKey: ["livestock"] });

      // Respaldar estado previo del cache
      const previousLivestock = queryClient.getQueryData(["livestock"]);

      // Actualizar optimistamente el cache removiendo el registro
      queryClient.setQueriesData({ queryKey: ["livestock"] }, (old: any) => {
        if (!old) return old;
        // Soporte para respuestas paginadas (PaginatedResponse)
        if (old.data && Array.isArray(old.data)) {
          return {
            ...old,
            data: old.data.filter((item: any) => item.id !== id),
          };
        }
        // Soporte para listas simples
        if (Array.isArray(old)) {
          return old.filter((item: any) => item.id !== id);
        }
        return old;
      });

      return { previousLivestock };
    },
    onError: (error: any, id, context) => {
      // Revertir al estado anterior en caso de fallo
      if (context?.previousLivestock) {
        queryClient.setQueryData(["livestock"], context.previousLivestock);
      }
      const message = error.response?.data?.message || "Error al eliminar el animal.";
      toast.error(message);
    },
    onSuccess: () => {
      toast.success("Animal eliminado exitosamente.");
    },
    onSettled: () => {
      // Sincronizar cache con el servidor al finalizar
      queryClient.invalidateQueries({ queryKey: ["livestock"] });
    },
  });
}
