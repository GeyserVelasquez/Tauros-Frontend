import { api } from "@/lib/api";
import { DashboardStatsResponse, dashboardStatsResponseSchema } from "../types";

/**
 * Obtiene las estadísticas del dashboard desde el backend.
 */
export async function getDashboardStats(): Promise<DashboardStatsResponse> {
  const { data } = await api.get<DashboardStatsResponse>("/dashboard/stats");
  // Validamos con Zod en runtime para garantizar la consistencia de los datos
  return dashboardStatsResponseSchema.parse(data);
}
