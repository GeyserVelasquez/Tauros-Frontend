import { z } from "zod";

export const clinicDiagnosticFormSchema = z.object({
  code: z.string().min(1, "El código es obligatorio"),
  name: z.string().min(1, "El nombre del diagnóstico es obligatorio"),
  attributes: z.array(
    z.object({
      key: z.string().min(1, "La propiedad es obligatoria"),
      value: z.string().min(1, "El valor es obligatorio"),
    })
  ),
});

export type ClinicDiagnosticFormData = z.infer<typeof clinicDiagnosticFormSchema>;

export interface ClinicDiagnostic {
  id: number;
  code: string;
  name: string;
  attributes: Record<string, string> | null;
  created_at: string;
  updated_at: string;
}
