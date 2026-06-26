import { useQuery } from "@tanstack/react-query";
import { getUser } from "../api/getUser";
import { useAuthStore } from "@/store/auth-store";
import { useEffect } from "react";

export const useUser = (options?: { enabled?: boolean }) => {
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);

  const query = useQuery({
    queryKey: ["auth-user"],
    queryFn: getUser,
    retry: false,
    staleTime: Infinity,
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess) {
      setUser(query.data);
      setLoading(false);
    } else if (query.isError) {
      setUser(null);
      setLoading(false);
    }
  }, [query.data, query.isSuccess, query.isError, setUser, setLoading]);

  return query;
};
