import { NextResponse } from "next/server";

// Aproximación matemática de la fórmula de Magnus-Tetens para calcular el punto de rocío (Dew Point)
// a partir de la temperatura (T) y la humedad relativa (RH).
function calculateDewPoint(temp: number, humidity: number): number {
  const a = 17.27;
  const b = 237.7;
  const alpha = ((a * temp) / (b + temp)) + Math.log(humidity / 100.0);
  const dewPoint = (b * alpha) / (a - alpha);
  return Math.round(dewPoint * 10) / 10;
}

export async function GET() {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const lat = process.env.WEATHER_LAT;
  const lon = process.env.WEATHER_LON;

  if (!apiKey || !lat || !lon) {
    return NextResponse.json(
      { error: "La configuración de OpenWeather no está completa en el servidor." },
      { status: 500 }
    );
  }

  try {
    // Consultamos la API Clásica 2.5 de OpenWeather en paralelo (Current y Forecast de 5 días/3 horas)
    // Estas APIs son 100% gratuitas y no requieren tarjeta de crédito
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${apiKey}`;

    const [currentRes, forecastRes] = await Promise.all([
      fetch(currentUrl, { next: { revalidate: 600 } }),
      fetch(forecastUrl, { next: { revalidate: 600 } }),
    ]);

    if (!currentRes.ok || !forecastRes.ok) {
      console.error("OpenWeather API Error:", {
        currentStatus: currentRes.status,
        forecastStatus: forecastRes.status,
      });
      return NextResponse.json(
        { error: "Error al obtener datos desde la API clásica de OpenWeather." },
        { status: 502 }
      );
    }

    const currentData = await currentRes.json();
    const forecastData = await forecastRes.json();

    // 1. Calculamos punto de rocío (no entregado por la API 2.5 clásica)
    const dewPoint = calculateDewPoint(currentData.main.temp, currentData.main.humidity);

    // 2. Construimos la estructura 'current' esperada por nuestro esquema Zod
    const currentProcessed = {
      temp: currentData.main.temp,
      feels_like: currentData.main.feels_like,
      humidity: currentData.main.humidity,
      dew_point: dewPoint,
      uvi: 0, // No disponible en API 2.5 gratuita (se setea en 0 por defecto)
      clouds: currentData.clouds.all,
      wind_speed: currentData.wind.speed,
      wind_deg: currentData.wind.deg,
      sunrise: currentData.sys.sunrise,
      sunset: currentData.sys.sunset,
      weather: currentData.weather || [],
    };

    // 3. Procesamos los datos por hora (hourly) de las próximas 24h
    // La API 2.5 da datos cada 3 horas, filtramos los primeros 8 items (8 * 3h = 24h)
    const hourlyProcessed = (forecastData.list || []).slice(0, 8).map((item: any) => ({
      dt: item.dt,
      temp: item.main.temp,
      humidity: item.main.humidity,
      weather: item.weather || [],
    }));

    // 4. Procesamos el pronóstico diario a partir del forecast de 5 días
    // Agrupamos por fecha para obtener la temperatura máxima y mínima del día
    const dailyMap: Record<string, any> = {};

    (forecastData.list || []).forEach((item: any) => {
      const dateStr = new Date(item.dt * 1000).toISOString().split("T")[0];
      if (!dailyMap[dateStr]) {
        dailyMap[dateStr] = {
          dt: item.dt,
          sunrise: currentData.sys.sunrise, // Simulamos el sol de hoy ya que el forecast 2.5 no lo trae
          sunset: currentData.sys.sunset,
          temp: {
            day: item.main.temp,
            min: item.main.temp_min,
            max: item.main.temp_max,
            night: item.main.temp,
            eve: item.main.temp,
            morn: item.main.temp,
          },
          humidity: item.main.humidity,
          wind_speed: item.wind.speed,
          weather: item.weather || [],
        };
      } else {
        // Actualizamos máximos y mínimos diarios
        dailyMap[dateStr].temp.min = Math.min(dailyMap[dateStr].temp.min, item.main.temp_min);
        dailyMap[dateStr].temp.max = Math.max(dailyMap[dateStr].temp.max, item.main.temp_max);
      }
    });

    const dailyProcessed = Object.values(dailyMap).slice(0, 5); // Nos quedamos con los 5 días disponibles

    const responsePayload = {
      current: currentProcessed,
      hourly: hourlyProcessed,
      daily: dailyProcessed,
      timezone: forecastData.city.timezone ? `GMT${forecastData.city.timezone >= 0 ? "+" : ""}${forecastData.city.timezone / 3600}` : "Local",
    };

    return NextResponse.json(responsePayload);
  } catch (error) {
    console.error("Error in weather API proxy:", error);
    return NextResponse.json(
      { error: "Error interno en el servidor de clima." },
      { status: 500 }
    );
  }
}
