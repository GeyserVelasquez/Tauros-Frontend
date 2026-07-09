import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El correo electrónico es requerido")
    .email("El correo electrónico no es válido"),
  password: z.string().min(1, "La contraseña es requerida"),
  remember: z.boolean().optional(),
});

export type LoginCredentials = z.infer<typeof loginSchema>;

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  roles?: string[];
  permissions?: string[];
}
