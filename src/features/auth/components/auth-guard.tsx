"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { useUser } from "../hooks/useUser";
import { Loader2 } from "lucide-react";

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { isLoading: queryLoading, isError } = useUser();
  const { isAuthenticated, isLoading: storeLoading } = useAuthStore();

  const loading = queryLoading || storeLoading;

  useEffect(() => {
    if (!loading && (!isAuthenticated || isError)) {
      router.replace("/login");
    }
  }, [isAuthenticated, loading, isError, router]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 font-montserrat">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-zinc-900 dark:text-zinc-50" />
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Cargando...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};
