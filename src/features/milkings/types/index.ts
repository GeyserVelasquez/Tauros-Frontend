import { z } from "zod";
import { Livestock } from "@/features/livestock";
import { Technician } from "@/features/technicians";

export const milkingFormSchema = z.object({
  livestock_id: z.number({ message: "Debe seleccionar un animal" }).min(1, "El animal es obligatorio"),
  made_at: z.string().min(1, "La fecha es obligatoria"),
  milking_type_id: z.number({ message: "Debe seleccionar el tipo de ordeño" }).min(1, "El tipo es obligatorio"),
  first_weight: z.coerce.number().min(0, "El peso no puede ser negativo"),
  second_weight: z.coerce.number().min(0, "El peso no puede ser negativo"),
  third_weight: z.coerce.number().min(0, "El peso no puede ser negativo"),
  technician_id: z.number().nullable().optional(),
});

export type MilkingFormData = z.infer<typeof milkingFormSchema>;

export interface MilkingType {
  id: number;
  code: string;
  name: string;
}

export interface Milking {
  id: number;
  livestock_id: number;
  made_at: string;
  milking_type_id: number;
  first_weight: number;
  second_weight: number;
  third_weight: number;
  technician_id: number | null;
  livestock?: Livestock;
  milking_type?: MilkingType;
  technician?: Technician;
  created_at: string;
  updated_at: string;
}
