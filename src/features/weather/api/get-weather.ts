import { weatherApi } from "@/lib/weather-api";
import { WeatherData, weatherDataSchema } from "../types";

/**
 * Obtiene la información climática unificada de la finca a través del proxy local.
 */
export async function getWeather(): Promise<WeatherData> {
  const { data } = await weatherApi.get<WeatherData>("/api/weather");
  // Validamos con Zod en runtime para asegurar la integridad de la estructura
  return weatherDataSchema.parse(data);
}
