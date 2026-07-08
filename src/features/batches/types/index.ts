import { z } from "zod";
import { Paddock } from "@/features/paddocks";
import { Livestock } from "@/features/livestock";

export const batchFormSchema = z.object({
  code: z.string().min(1, "El código del lote es obligatorio"),
  name: z.string().min(1, "El nombre del lote es obligatorio"),
  paddock_id: z.number().nullable().optional(),
});

export type BatchFormData = z.infer<typeof batchFormSchema>;

export interface Batch {
  id: number;
  code: string;
  name: string;
  paddock_id: number | null;
  paddock?: Paddock;
  livestock?: Livestock[];
  livestock_count?: number;
}
