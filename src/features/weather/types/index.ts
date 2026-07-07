import { z } from "zod";

// Datos de clima actuales simplificados
export const currentWeatherSchema = z.object({
  temp: z.number(),
  feels_like: z.number(),
  humidity: z.number(),
  dew_point: z.number(),
  uvi: z.number(),
  clouds: z.number(),
  wind_speed: z.number(),
  wind_deg: z.number(),
  sunrise: z.number(),
  sunset: z.number(),
  weather: z.array(
    z.object({
      id: z.number(),
      main: z.string(),
      description: z.string(),
      icon: z.string(),
    })
  ),
});

// Clima por hora para las últimas 24h
export const hourlyWeatherSchema = z.object({
  dt: z.number(),
  temp: z.number(),
  humidity: z.number(),
  weather: z.array(
    z.object({
      icon: z.string(),
      description: z.string(),
    })
  ),
});

// Pronóstico diario para 7 días
export const dailyWeatherSchema = z.object({
  dt: z.number(),
  sunrise: z.number(),
  sunset: z.number(),
  temp: z.object({
    day: z.number(),
    min: z.number(),
    max: z.number(),
    night: z.number(),
    eve: z.number(),
    morn: z.number(),
  }),
  humidity: z.number(),
  wind_speed: z.number(),
  weather: z.array(
    z.object({
      id: z.number(),
      main: z.string(),
      description: z.string(),
      icon: z.string(),
    })
  ),
});

// Respuesta consolidada y procesada que entregará nuestro Proxy API
export const weatherDataSchema = z.object({
  current: currentWeatherSchema,
  hourly: z.array(hourlyWeatherSchema),
  daily: z.array(dailyWeatherSchema),
  timezone: z.string(),
});

export type CurrentWeather = z.infer<typeof currentWeatherSchema>;
export type HourlyWeather = z.infer<typeof hourlyWeatherSchema>;
export type DailyWeather = z.infer<typeof dailyWeatherSchema>;
export type WeatherData = z.infer<typeof weatherDataSchema>;
