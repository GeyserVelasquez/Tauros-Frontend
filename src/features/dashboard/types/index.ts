import { z } from "zod";
import { AnimalCategory, State } from "@/features/livestock/types";

export const categoryStatSchema = z.object({
  category: z.string(),
  count: z.number().int().nonnegative(),
  percentage: z.number().nonnegative(),
});

export const healthStatSchema = z.object({
  category: z.string(),
  count: z.number().int().nonnegative(),
  percentage: z.number().nonnegative(),
});

export const reproductiveStatSchema = z.object({
  status: z.string(),
  count: z.number().int().nonnegative(),
  percentage: z.number().nonnegative(),
});

export const dashboardStatsResponseSchema = z.object({
  data: z.object({
    category_distribution: z.array(categoryStatSchema),
    health_status: z.array(healthStatSchema),
    reproductive_status_distribution: z.array(reproductiveStatSchema),
  }),
});

export type CategoryStat = z.infer<typeof categoryStatSchema>;
export type HealthStat = z.infer<typeof healthStatSchema>;
export type ReproductiveStat = z.infer<typeof reproductiveStatSchema>;
export type DashboardStatsResponse = z.infer<typeof dashboardStatsResponseSchema>;

export const REPRODUCTIVE_STATUS_LABELS: Record<string, string> = {
  pregnant: "Preñada",
  heat: "En Celo",
  empty: "Vacía",
  waiting: "En Espera",
};
