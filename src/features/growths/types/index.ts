import { z } from "zod";
import { Livestock } from "@/features/livestock";
import { Technician } from "@/features/technicians";

export const growthFormSchema = z.object({
  livestock_id: z.number({ message: "Debe seleccionar un animal" }).min(1, "El animal es obligatorio"),
  made_at: z.string().min(1, "La fecha es obligatoria"),
  growth_type_id: z.number({ message: "Debe seleccionar el tipo de registro" }).min(1, "El tipo es obligatorio"),
  weight: z.coerce.number().min(0.01, "El peso debe ser mayor a 0"),
  height: z.coerce.number().min(0, "La altura no puede ser negativa").nullable().optional(),
  length: z.coerce.number().min(0, "El largo no puede ser negativo").nullable().optional(),
  thoracic_width: z.coerce.number().min(0, "El ancho torácico no puede ser negativo").nullable().optional(),
  technician_id: z.number().nullable().optional(),
});

export type GrowthFormData = z.infer<typeof growthFormSchema>;

export interface GrowthType {
  id: number;
  code: string;
  name: string;
}

export interface Growth {
  id: number;
  livestock_id: number;
  made_at: string;
  growth_type_id: number;
  weight: number;
  height: number | null;
  length: number | null;
  thoracic_width: number | null;
  technician_id: number | null;
  livestock?: Livestock;
  growth_type?: GrowthType;
  technician?: Technician;
  created_at: string;
  updated_at: string;
}
