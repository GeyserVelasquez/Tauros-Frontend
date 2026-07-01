import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createBirth, updateBirth, deleteBirth } from "../api/mutateBirths";

export function useCreateBirth() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: createBirth,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["births"] });
      queryClient.invalidateQueries({ queryKey: ["livestock"] });
      toast.success("Parto y crías registrados exitosamente.");
      router.push("/dashboard/reproduction/births");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al registrar el parto.";
      toast.error(message);
    },
  });
}

export function useUpdateBirth(id: number) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (formData: any) => updateBirth({ id, formData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["births"] });
      toast.success("Parto actualizado correctamente.");
      router.push("/dashboard/reproduction/births");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al actualizar el parto.";
      toast.error(message);
    },
  });
}

export function useDeleteBirth() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBirth,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["births"] });
      toast.success("Registro de parto eliminado.");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al eliminar el registro.";
      toast.error(message);
    },
  });
}
