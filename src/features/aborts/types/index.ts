import { z } from "zod";
import { Livestock } from "@/features/livestock";

export const abortFormSchema = z.object({
  livestock_id: z.number({ message: "Debe seleccionar un animal" }).min(1, "El animal es obligatorio"),
  made_at: z.string().min(1, "La fecha del aborto es obligatoria"),
  abort_type_id: z.number({ message: "Debe seleccionar el tipo de aborto" }).min(1, "El tipo es obligatorio"),
  technician_id: z.number().nullable().optional(),
});

export type AbortFormData = z.infer<typeof abortFormSchema>;

export interface AbortType {
  id: number;
  code: string;
  name: string;
}

export interface Technician {
  id: number;
  name: string;
}

export interface Abort {
  id: number;
  livestock_id: number;
  made_at: string;
  abort_type_id: number;
  technician_id: number | null;
  livestock?: Livestock;
  abort_type?: AbortType;
  technician?: Technician;
  created_at: string;
  updated_at: string;
}
