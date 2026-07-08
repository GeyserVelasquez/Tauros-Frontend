import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createCertificate, updateCertificate, deleteCertificate } from "../api/mutateCertificates";

export function useCreateCertificate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCertificate,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["certificates"] });
      queryClient.invalidateQueries({ queryKey: ["livestock"] });
      queryClient.invalidateQueries({ queryKey: ["batches"] });
      toast.success(`Certificado registrado exitosamente: ${data.certificate_number}`);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al registrar el certificado. Inténtalo de nuevo.";
      toast.error(message);
    },
  });
}

export function useUpdateCertificate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }: { id: string | number; formData: any }) => updateCertificate(id, formData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["certificates"] });
      toast.success(`Certificado ${data.certificate_number} actualizado correctamente.`);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al actualizar el certificado. Inténtalo de nuevo.";
      toast.error(message);
    },
  });
}

export function useDeleteCertificate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCertificate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certificates"] });
      queryClient.invalidateQueries({ queryKey: ["livestock"] });
      queryClient.invalidateQueries({ queryKey: ["batches"] });
      toast.success("Certificado eliminado exitosamente.");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al eliminar el certificado.";
      toast.error(message);
    },
  });
}
