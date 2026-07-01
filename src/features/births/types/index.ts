import { z } from "zod";
import { Livestock } from "@/features/livestock";

export interface LookupItem {
  id: number;
  name: string;
}

// 1. Esquema Cabecera del Parto (Paso 1)
export const baseBirthSchema = z.object({
  mother_id: z.number().min(1, "La madre es obligatoria"),
  birth_date: z.string().min(1, "La fecha de nacimiento es obligatoria"),
  postbirth_revision_date: z.string().min(1, "La fecha de revisión es obligatoria"),
  birth_type_id: z.number().min(1, "El tipo de parto es obligatorio"),
  technician_id: z.number().nullable().optional(),
  newborns_count: z.number().min(1).max(3).optional(),
});

// 2. Esquema Datos Requeridos de una Cría (Paso 2)
export const newbornRequiredSchema = z.object({
  brand_number: z.string().min(1, "El número de marca/arete es obligatorio").toUpperCase(),
  animal_category: z.enum(["heifer_calf", "bull_calf"], {
    message: "Seleccione una categoría válida",
  }),
  entry_cause_id: z.coerce.number().min(1, "La causa es obligatoria"),
  state_id: z.coerce.number().min(1, "El estado es obligatorio"),
  newborn_type_id: z.coerce.number().min(1, "El tipo es obligatorio"),
});

// 3. Esquema Datos Opcionales de una Cría (Paso 2 - Collapsible)
export const newbornOptionalSchema = z.object({
  color_id: z.number().nullable().optional(),
  breed_id: z.number().nullable().optional(),
  father_id: z.number().nullable().optional(),
  electronic_code: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
  general_comment: z.string().nullable().optional(),
});

// 4. Esquema Unificado de Cría
export const newbornFormSchema = newbornRequiredSchema.merge(newbornOptionalSchema);

// 5. Esquema del Wizard
export const birthWizardSchema = baseBirthSchema.extend({
  newborns: z.array(newbornFormSchema).optional(),
});

export const birthFlatSchema = baseBirthSchema.extend({
  brand_number: z.string().min(1, "El número de marca/arete es obligatorio").toUpperCase(),
  animal_category: z.enum(["heifer_calf", "bull_calf"], {
    message: "Seleccione una categoría válida",
  }),
  entry_cause_id: z.coerce.number().min(1, "La causa es obligatoria"),
  state_id: z.coerce.number().min(1, "El estado es obligatorio"),
  newborn_type_id: z.coerce.number().min(1, "El tipo es obligatorio"),
  color_id: z.number().nullable().optional(),
  breed_id: z.number().nullable().optional(),
  father_id: z.number().nullable().optional(),
  electronic_code: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
  general_comment: z.string().nullable().optional(),
});

export type NewbornFormData = z.infer<typeof newbornFormSchema>;
export type BirthFormData = z.infer<typeof baseBirthSchema>;
export type BirthWizardData = z.infer<typeof birthWizardSchema>;
export type BirthFlatFormData = z.infer<typeof birthFlatSchema>;

// Interfaces del recurso API Laravel
export interface Newborn {
  id: number;
  newborn_type_id: number;
  livestock_id: number;
  livestock?: Livestock;
  newborn_type?: LookupItem;
}

export interface Birth {
  id: number;
  mother_id: number;
  birth_date: string;
  postbirth_revision_date: string;
  birth_type_id: number;
  technician_id: number | null;
  created_at: string;
  mother?: Livestock;
  technician?: LookupItem;
  birth_type?: LookupItem;
  newborns?: Newborn[];
}
