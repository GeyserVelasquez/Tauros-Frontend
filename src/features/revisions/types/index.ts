import { z } from "zod";
import { Livestock } from "@/features/livestock";

export const revisionFormSchema = z.object({
  livestock_id: z.number({ message: "Debe seleccionar un animal" }).min(1, "El animal es obligatorio"),
  made_at: z.string().min(1, "La fecha de registro es obligatoria"),
  revision_result: z.enum(["pregnant", "empty", "waiting"], {
    message: "Resultado de revisión inválido",
  }),
  revision_type_id: z.number({ message: "Debe seleccionar el tipo de revisión" }).min(1, "El tipo es obligatorio"),
  technician_id: z.number().nullable().optional(),
});

export type RevisionFormData = z.infer<typeof revisionFormSchema>;

export interface RevisionType {
  id: number;
  code: string;
  name: string;
}

export interface Technician {
  id: number;
  name: string;
}

export interface Revision {
  id: number;
  livestock_id: number;
  made_at: string;
  revision_result: "pregnant" | "empty" | "waiting";
  revision_type_id: number;
  technician_id: number | null;
  livestock?: Livestock;
  revision_type?: RevisionType;
  technician?: Technician;
  created_at: string;
  updated_at: string;
}
