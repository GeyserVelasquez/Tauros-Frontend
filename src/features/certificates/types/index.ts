import { z } from "zod";
import { Livestock } from "@/features/livestock";
import { Batch } from "@/features/batches";

export const certificateFormSchema = z.object({
  certificate_number: z.string().min(1, "El número de certificado es obligatorio"),
  issue_date: z.string().min(1, "La fecha de expedición es obligatoria"),
  expiry_date: z.string().optional().or(z.literal("")),
  assign_by: z.enum(["batch", "individual"]),
  batch_id: z.number().nullable().optional(),
  livestock_ids: z.array(z.number()).optional(),
  file: z.any().optional(), // z.any() es más seguro para SSR
}).refine((data) => {
  if (data.assign_by === "batch" && !data.batch_id) {
    return false;
  }
  if (data.assign_by === "individual" && (!data.livestock_ids || data.livestock_ids.length === 0)) {
    return false;
  }
  return true;
}, {
  message: "Debe seleccionar un lote o al menos un animal",
  path: ["assign_by"]
}).refine((data) => {
  if (!data.issue_date || !data.expiry_date) return true;
  return new Date(data.expiry_date) >= new Date(data.issue_date);
}, {
  message: "La fecha de vencimiento debe ser posterior o igual a la de expedición",
  path: ["expiry_date"]
});

export type CertificateFormData = z.infer<typeof certificateFormSchema>;

export interface Certificate {
  id: number;
  certificate_number: string;
  issue_date: string;
  expiry_date: string;
  file_path: string | null;
  livestock?: Livestock[];
  batches?: Batch[];
  created_at?: string;
  updated_at?: string;
}
