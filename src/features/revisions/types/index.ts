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

export type RevisionResult = "pregnant" | "empty" | "waiting";

export const REVISION_RESULT_LABELS: Record<RevisionResult, string> = {
  pregnant: "Preñada",
  empty: "Vacía",
  waiting: "En Espera",
};

export const REVISION_RESULT_OPTIONS = Object.entries(REVISION_RESULT_LABELS).map(
  ([id, name]) => ({
    id: id as RevisionResult,
    name,
  })
);

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
  revision_result: RevisionResult;
  revision_type_id: number;
  technician_id: number | null;
  livestock?: Livestock;
  revision_type?: RevisionType;
  technician?: Technician;
  created_at: string;
  updated_at: string;
}
