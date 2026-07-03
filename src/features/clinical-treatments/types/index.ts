import { z } from "zod";

export const clinicalTreatmentFormSchema = z.object({
  code: z.string().min(1, "El código es obligatorio"),
  name: z.string().min(1, "El nombre del tratamiento es obligatorio"),
  attributes: z.array(
    z.object({
      key: z.string().min(1, "La propiedad es obligatoria"),
      value: z.string().min(1, "El valor es obligatorio"),
    })
  ),
});

export type ClinicalTreatmentFormData = z.infer<typeof clinicalTreatmentFormSchema>;

export interface ClinicalTreatment {
  id: number;
  code: string;
  name: string;
  attributes: Record<string, string> | null;
  created_at: string;
  updated_at: string;
}
