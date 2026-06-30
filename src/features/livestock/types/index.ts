import { z } from "zod";

export type AnimalCategory =
  | "bull"
  | "steer"
  | "male_yearling"
  | "bull_calf"
  | "cow"
  | "heifer"
  | "female_yearling"
  | "heifer_calf";

export const ANIMAL_CATEGORY_LABELS: Record<AnimalCategory, string> = {
  bull: "Toro",
  steer: "Novillo",
  male_yearling: "Maute",
  bull_calf: "Becerro",
  cow: "Vaca",
  heifer: "Novilla",
  female_yearling: "Mauta",
  heifer_calf: "Becerra",
};

export const ANIMAL_CATEGORY_OPTIONS = Object.entries(ANIMAL_CATEGORY_LABELS).map(
    ([id, name]) => ({
      id: id as AnimalCategory,
      name,
    })
);

export const livestockFormSchema = z.object({
  brand_number: z.string().min(1, "El número de marca/arete es obligatorio"),
  electronic_code: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
  birth_date: z.string().nullable().optional(),
  entry_date: z.string().nullable().optional(),
  general_comment: z.string().nullable().optional(),
  tits: z.number().min(0, "La cantidad de tetas debe ser mayor o igual a 0"),
  is_enabled: z.boolean(),
  is_alive: z.boolean(),
  animal_category: z.string().min(1, "La categoría es obligatoria"),
  entry_cause_id: z.number().min(1, "La causa de ingreso es obligatoria"),
  state_id: z.number().min(1, "El estado es obligatorio"),
  breed_id: z.number().nullable().optional(),
  color_id: z.number().nullable().optional(),
  classification_id: z.number().nullable().optional(),
  owner_id: z.number().nullable().optional(),
  technician_id: z.number().nullable().optional(),
  father_id: z.number().nullable().optional(),
  mother_id: z.number().nullable().optional(),
  adoptive_mother_id: z.number().nullable().optional(),
  receiving_mother_id: z.number().nullable().optional(),
});

export type LivestockFormData = z.infer<typeof livestockFormSchema>;

export interface Livestock {
  id: number;
  brand_number: string;
  electronic_code: string | null;
  name: string | null;
  birth_date: string | null;
  entry_date: string | null;
  general_comment: string | null;
  tits: number;
  is_enabled: boolean;
  is_alive: boolean;
  animal_category: AnimalCategory;
  entry_cause_id: number;
  state_id: number;
  breed_id: number | null;
  color_id: number | null;
  classification_id: number | null;
  owner_id: number | null;
  technician_id: number | null;
  father_id: number | null;
  mother_id: number | null;
  adoptive_mother_id: number | null;
  receiving_mother_id: number | null;
  
  // Relaciones
  breed?: { id: number; name: string };
  color?: { id: number; name: string };
  classification?: { id: number; name: string };
  state?: { id: number; name: string };
  entry_cause?: { id: number; name: string };
  owner?: { id: number; name: string };
  technician?: { id: number; name: string };
  father?: Livestock;
  mother?: Livestock;
  adoptive_mother?: Livestock;
  receiving_mother?: Livestock;
  batch?: { id: number; name: string };
}

