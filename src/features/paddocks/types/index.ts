import { z } from "zod";

export const paddockFormSchema = z.object({
  name: z.string().min(1, "El nombre del potrero es obligatorio"),
  code: z.string().nullable().optional(),
  area: z.union([z.number(), z.string()]).nullable().optional(),
});

export type PaddockFormData = z.infer<typeof paddockFormSchema>;

export interface Paddock {
  id: number;
  name: string;
  code: string | null;
  area: number | string | null;
  livestock_count?: number;
}
