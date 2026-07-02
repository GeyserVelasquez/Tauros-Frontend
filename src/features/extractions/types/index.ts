import { z } from "zod";
import { Livestock } from "@/features/livestock";

export interface LookupItem {
  id: number;
  name: string;
}

// 1. Zod validation schema for form data
export const extractionFormSchema = z.object({
  made_at: z.string().min(1, "La fecha es obligatoria"),
  extraction_type_id: z.coerce.number().min(1, "El tipo de extracción es obligatorio"),
  technician_id: z.number().nullable().optional(),
  quantity: z.coerce.number().min(1, "La cantidad debe ser mayor a 0"),
  
  // Dynamic batch creation fields
  geneticable_type: z.enum(["semen_batch", "embrion_batch"], {
    message: "Seleccione un tipo de lote válido",
  }),
  code: z.string().min(1, "El código del lote es obligatorio").toUpperCase(),
  female_id: z.coerce.number().min(1, "El donante es obligatorio"), // Male donor for semen, Female donor for embryos
  male_id: z.number().nullable().optional(), // Male sire (only embryos)
});

export type ExtractionFormData = z.infer<typeof extractionFormSchema>;

// 2. Semen and Embryo Batch structures
export interface SemenBatch {
  id: number;
  code: string;
  name: string;
  livestock_id: number;
  livestock?: Livestock;
}

export interface EmbrionBatch {
  id: number;
  code: string;
  name: string;
  mother_id: number;
  father_id: number | null;
  mother?: Livestock;
  father?: Livestock;
}

// 3. Extraction structure representing database model
export interface Extraction {
  id: number;
  geneticable_type: string;
  geneticable_id: number;
  technician_id: number | null;
  extraction_type_id: number;
  made_at: string;
  quantity: number;
  created_at: string;
  geneticable?: SemenBatch | EmbrionBatch;
  technician?: LookupItem;
  extraction_type?: LookupItem;
}

// Semen and embryo batch options mappings
export const BATCH_TYPE_OPTIONS = [
  { id: "semen_batch", name: "Semen (Pajuela)" },
  { id: "embrion_batch", name: "Embrión" },
];
