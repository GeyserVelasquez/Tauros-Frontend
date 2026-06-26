import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { logout } from "../api/logout";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const reset = useAuthStore((state) => state.reset);

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      reset();
      queryClient.setQueryData(["auth-user"], null);
      queryClient.clear();
      toast.success("Sesión cerrada correctamente.");
      router.push("/login");
    },
    onError: () => {
      toast.error("Ocurrió un error al intentar cerrar la sesión.");
    },
  });
};
