import { z } from "zod";

// Base validation schema for Clinic History metadata
export const clinicHistoryBaseSchema = z.object({
  code: z.string().min(1, "El código es obligatorio"),
  name: z.string().min(1, "El nombre/título de la consulta es obligatorio"),
  description: z.string().nullable().optional(),
  livestock_id: z.union([z.string(), z.number()]).transform((val) => String(val)),
  technician_id: z.union([z.string(), z.number()]).nullable().optional().transform((val) => val ? String(val) : null),
});

// Validation schema for Clinic Diagnostics list
export const clinicHistoryDiagnosticsSchema = z.object({
  diagnostics: z.array(z.union([z.string(), z.number()])).transform((arr) => arr.map(String)).refine((arr) => arr.length > 0, "Debe seleccionar al menos un diagnóstico"),
});

// Validation schema for single treatment item in clinic history
export const clinicHistoryTreatmentItemSchema = z.object({
  clinical_treatment_id: z.union([z.string(), z.number()]).transform((val) => String(val)),
  supply_id: z.union([z.string(), z.number()]).nullable().optional().transform((val) => val ? String(val) : null),
  quantity: z.coerce.number().min(0.01, "La cantidad debe ser mayor a 0"),
  first_dose_date: z.string().optional(),
  is_first_dose_applied: z.boolean().default(true),
  
  is_recurring: z.boolean().default(false),
  frequency_hours: z.coerce.number().min(1).optional(),
  total_doses: z.coerce.number().min(1).optional(),
}).refine(
  (data) => !data.is_recurring || (data.frequency_hours && data.frequency_hours > 0),
  { message: "La frecuencia en horas es obligatoria para tratamientos recurrentes", path: ["frequency_hours"] }
).refine(
  (data) => !data.is_recurring || (data.total_doses && data.total_doses > 0),
  { message: "El total de dosis es obligatorio para tratamientos recurrentes", path: ["total_doses"] }
);

// Validation schema for Clinical Treatments list
export const clinicHistoryTreatmentsSchema = z.object({
  treatments: z.array(clinicHistoryTreatmentItemSchema).min(1, "Debe agregar al menos un tratamiento"),
});

// Composed Validation Schema for full Clinic History Form
export const clinicHistoryFormSchema = clinicHistoryBaseSchema
  .merge(clinicHistoryDiagnosticsSchema)
  .merge(clinicHistoryTreatmentsSchema);

export type ClinicHistoryFormData = z.infer<typeof clinicHistoryFormSchema>;
export type ClinicHistoryTreatmentItem = z.infer<typeof clinicHistoryTreatmentItemSchema>;

export interface ClinicHistory {
  id: number;
  code: string;
  name: string;
  description: string | null;
  attributes: Record<string, string> | null;
  livestock_id: number;
  technician_id: number | null;
  created_at: string;
  updated_at: string;

  // Loaded relationships
  livestock?: {
    id: number;
    name: string;
    brand_number: string;
    code?: string;
  };
  technician?: {
    id: number;
    name: string;
  };
  clinic_diagnostics?: Array<{
    id: number;
    code: string;
    name: string;
  }>;
  clinical_treatments?: Array<{
    id: number;
    code: string;
    name: string;
  }>;
  treatment_applications?: Array<{
    id: number;
    livestock_id: number;
    clinical_treatment_id: number;
    supply_id: number | null;
    dose_number: number | null;
    quantity: number;
    quantity_formatted: number;
    scheduled_date: string;
    applied_at: string | null;
    applied_by_id: number | null;
  }>;
}
