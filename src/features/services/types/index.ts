import { z } from "zod";
import { Livestock } from "@/features/livestock";

export interface ServiceType {
  id: number;
  code: "NATURAL" | "AI" | "TE";
  name: string;
}

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
  father_id: number;
  mother?: Livestock;
  father?: Livestock;
}

export interface Technician {
  id: number;
  code: string;
  name: string;
  telephone?: string | null;
}

export const serviceFormSchema = z.object({
  female_id: z.number({ message: "Debe seleccionar una hembra (madre)" }).min(1, "La hembra es obligatoria"),
  service_type_id: z.number({ message: "Debe seleccionar el tipo de servicio" }).min(1, "El tipo de servicio es obligatorio"),
  made_at: z.string().min(1, "La fecha de servicio es obligatoria"),
  technician_id: z.number().nullable().optional(),
  parentable_type: z.enum(["livestock", "semen_batch", "embrion_batch"], {
    message: "Tipo parental inválido",
  }),
  parentable_id: z.number({ message: "Debe seleccionar el semental o lote correspondiente" }).min(1, "El parental es obligatorio"),
});

export type ServiceFormData = z.infer<typeof serviceFormSchema>;

export interface Service {
  id: number;
  female_id: number;
  service_type_id: number;
  made_at: string;
  technician_id: number | null;
  parentable_type: "livestock" | "semen_batch" | "embrion_batch";
  parentable_id: number;
  
  // Relaciones
  female?: Livestock;
  technician?: Technician;
  service_type?: ServiceType;
  parentable?: Livestock | SemenBatch | EmbrionBatch;
}
