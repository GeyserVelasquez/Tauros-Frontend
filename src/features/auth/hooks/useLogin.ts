import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { login } from "../api/login";
import { useAuthStore } from "@/store/auth-store";
import { getUser } from "../api/getUser";
import { toast } from "sonner";

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: login,
    onSuccess: async () => {
      try {
        const user = await getUser();
        setUser(user);
        queryClient.setQueryData(["auth-user"], user);
        toast.success("¡Bienvenido de nuevo!");
        router.push("/dashboard");
      } catch (error) {
        toast.error("Error al obtener los datos del usuario después de iniciar sesión.");
      }
    },
  });
};
