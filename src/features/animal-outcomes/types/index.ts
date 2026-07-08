import { z } from "zod";
import { Livestock } from "@/features/livestock";

// 1. Zod Enum de salida y Tipo inferido
export const OutcomeTypeEnum = z.enum(["death", "sale", "transfer", "slaughter"]);
export type OutcomeType = z.infer<typeof OutcomeTypeEnum>;

// 2. Labels del Enum
export const OUTCOME_TYPE_LABELS: Record<OutcomeType, string> = {
  death: "Muerte / Deceso",
  sale: "Venta",
  transfer: "Traspaso",
  slaughter: "Mandado a matadero",
};

// 3. Opciones dinámicas para el componente de UI
export const OUTCOME_TYPE_OPTIONS = Object.entries(OUTCOME_TYPE_LABELS).map(
  ([id, name]) => ({
    id: id as OutcomeType,
    name,
  })
);

export interface DeathCause {
  id: number;
  name: string;
}

// 4. Esquema de validación del formulario
export const outcomeFormSchema = z.object({
  livestock_id: z.number({ message: "Debe seleccionar un animal" }).min(1, "El animal es obligatorio"),
  outcome_type: OutcomeTypeEnum,
  made_at: z.string().min(1, "La fecha de salida es obligatoria"),
  death_cause_id: z.number().nullable().optional(),
}).refine((data) => {
  if (data.outcome_type === "death" && !data.death_cause_id) {
    return false;
  }
  return true;
}, {
  message: "Debe seleccionar una causa de muerte",
  path: ["death_cause_id"],
});

export type OutcomeFormData = z.infer<typeof outcomeFormSchema>;

export interface AnimalOutcome {
  id: number;
  livestock_id: number;
  outcome_type: OutcomeType;
  made_at: string;
  death_cause_id: number | null;
  livestock?: Livestock;
  death_cause?: DeathCause;
  created_at: string;
  updated_at: string;
}
