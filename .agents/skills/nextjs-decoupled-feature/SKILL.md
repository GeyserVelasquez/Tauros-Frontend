---
name: nextjs-decoupled-feature
description: Guide to implement any decoupled business feature in Next.js using a layered feature-based architecture (api, components, hooks, types, index).
---

# Architecture Blueprint: Decoupled Features in Next.js (App Router)

This skill outlines the standard design pattern and layered abstraction model for building business features in the Farm Management System (FMS). By separating concerns into distinct layers, features remain highly decoupled, easily testable, and robust against network latency.

---

## 🏗️ Directory Architecture

Every business feature (e.g., `cattle`, `milking`, `health`) lives in its own directory inside `src/features/[feature]/` with five core elements:

```text
src/features/[feature]/
├── api/          # Layer 1: HTTP API services (pure async functions)
├── types/        # Layer 2: Schemas & TypeScript typings
├── hooks/        # Layer 3: TanStack Query logic & local state
├── components/   # Layer 4: Pure UI presentation components
└── index.ts      # Layer 5: Central export interface
```

---

## ⚡ Layer Breakdown & Implementation Rules

Using a generic **`Cattle`** feature as an example, here is how each layer is constructed:

### Layer 1: Types & Schemas (`types/index.ts`)
* **Purpose**: Defines TypeScript interfaces representing Laravel API JSON responses, and Zod schemas for input validation.
* **Rule**: All schemas must validate in real-time. Do not write validation logic in component files.

```typescript
import { z } from "zod";

// Zod schema for input validation (e.g. creating/editing cattle)
export const cattleFormSchema = z.object({
  tag_number: z.string().min(1, "El número de arete es obligatorio"),
  breed_id: z.string().min(1, "La raza es obligatoria"),
  weight: z.number().positive("El peso debe ser mayor a 0"),
});

export type CattleFormData = z.infer<typeof cattleFormSchema>;

// Interface matching Laravel API resource
export interface Livestock {
  id: number;
  tag_number: string;
  breed_name: string;
  weight: number;
  created_at: string;
}
```

### Layer 2: API Services (`api/[action].ts`)
* **Purpose**: Pure async functions executing HTTP requests using the global Axios instance.
* **Rule**: Do not manage React state, routing, or toast notifications inside these files. Only request data and return responses.

```typescript
import { api } from "@/lib/api";
import { Livestock, CattleFormData } from "../types";

export const getCattleList = async (): Promise<Livestock[]> => {
  const { data } = await api.get<Livestock[]>("/livestock");
  return data;
};

export const createCattle = async (formData: CattleFormData): Promise<Livestock> => {
  const { data } = await api.post<Livestock>("/livestock", formData);
  return data;
};
```

### Layer 3: TanStack Query Hooks (`hooks/use[Action].ts`)
* **Purpose**: Encapsulates data fetching, caching, loading states, mutations, and side effects.
* **Rule**: Any logic that exceeds 10–15 lines inside a component must be extracted into a custom hook. Keep components purely visual.

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCattleList, createCattle } from "../api";
import { toast } from "sonner";

export const useCattle = () => {
  return useQuery({
    queryKey: ["cattle"],
    queryFn: getCattleList,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};

export const useCreateCattle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCattle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cattle"] });
      toast.success("Animal registrado correctamente.");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al registrar el animal.";
      toast.error(message);
    },
  });
};
```

### Layer 4: Presentation Components (`components/`)
* **Purpose**: Simple, stateless (or UI-only state) components that render the interface.
* **Rule**: Never call `api.get()` or `api.post()` inside components. Import and execute the hooks from Layer 3 instead.

```typescript
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cattleFormSchema, CattleFormData } from "../types";
import { useCreateCattle } from "../hooks/useCreateCattle";
import { Button } from "@/components/ui/button";

export function CattleForm() {
  const { mutate, isPending } = useCreateCattle();
  
  const { register, handleSubmit, formState: { errors } } = useForm<CattleFormData>({
    resolver: zodResolver(cattleFormSchema),
    mode: "onChange",
  });

  const onSubmit = (data: CattleFormData) => {
    mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-montserrat">
      <div>
        <label>Número de Arete</label>
        <input {...register("tag_number")} disabled={isPending} />
        {errors.tag_number && <p className="text-red-500">{errors.tag_number.message}</p>}
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Registrando..." : "Registrar Animal"}
      </Button>
    </form>
  );
}
```

### Layer 5: Feature Entry Point (`index.ts`)
* **Purpose**: Centralized export point for the feature.
* **Rule**: Components outside this directory (like pages in `src/app/`) must import variables exclusively from `index.ts`. Do not import from nested paths.

```typescript
// src/features/[feature]/index.ts
export * from "./types";
export * from "./hooks/useCattle";
export * from "./hooks/useCreateCattle";
export * from "./components/CattleForm";
```

---

## 🔑 Architectural Golden Rules

1. **Strict Decoupling**: Visual layout files in `src/app/` should contain minimal markup and only render components imported from features.
2. **State Separation**:
   * Use **TanStack Query** for backend state (caches, filters, database actions).
   * Use **Zustand** (global) or local React state for UI-only variables (toggles, active tab index).
3. **No Direct Axios calls**: Components must not import the `api` Axios client. Only files inside the feature's `api/` directory are allowed to do so.
4. **Optimistic Updates**: For critical actions in low-connectivity areas, implement TanStack Query optimistic updates inside hooks to hide network latency.
