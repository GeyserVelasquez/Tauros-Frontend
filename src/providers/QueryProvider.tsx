// src/components/providers/QueryProvider.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
    // Creamos el cliente en un estado para asegurar que sea único por ciclo de vida
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                // Evita que los datos se marquen como "stale" (viejos) instantáneamente
                staleTime: 60 * 1000,
            },
        },
    }));

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};