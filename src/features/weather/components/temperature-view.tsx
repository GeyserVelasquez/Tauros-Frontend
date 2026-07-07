"use client";

import { useMemo } from "react";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { 
  Thermometer, Wind, Eye, Compass, Cloud, Sun, Sunrise, Sunset, ChevronLeft, ArrowDown, ArrowUp 
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWeather } from "../hooks/useWeather";

export function TemperatureView() {
  const { data, isLoading, isError, refetch } = useWeather();

  const hourlyData = useMemo(() => {
    if (!data?.hourly) return [];
    return data.hourly.map((h) => {
      const date = new Date(h.dt * 1000);
      return {
        time: date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
        temp: Math.round(h.temp),
      };
    });
  }, [data]);

  const forecastData = useMemo(() => {
    if (!data?.daily) return [];
    // Filtramos para obtener exactamente 5 días de pronóstico para el grid de 5 columnas
    return data.daily.slice(1, 6).map((d) => {
      const date = new Date(d.dt * 1000);
      return {
        day: date.toLocaleDateString("es-ES", { weekday: "short" }),
        min: Math.round(d.temp.min),
        max: Math.round(d.temp.max),
      };
    });
  }, [data]);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse p-6">
        <div className="h-10 w-48 bg-muted rounded" />
        <div className="grid gap-6 md:grid-cols-3">
          <div className="h-32 bg-muted rounded-xl" />
          <div className="h-32 bg-muted rounded-xl" />
          <div className="h-32 bg-muted rounded-xl" />
        </div>
        <div className="h-[400px] bg-muted rounded-xl" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
        <Thermometer className="h-12 w-12 text-destructive" />
        <h3 className="font-semibold text-lg font-montserrat">Error al cargar datos térmicos</h3>
        <Button onClick={() => refetch()} variant="outline">Reintentar</Button>
      </div>
    );
  }

  const { current, daily } = data;
  const today = daily[0];

  const formatWindDir = (deg: number) => {
    const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    const idx = Math.round(((deg %= 360) < 0 ? deg + 360 : deg) / 22.5) % 16;
    return directions[idx];
  };

  return (
    <div className="space-y-6">
      {/* Volver y Header */}
      <div className="flex flex-col gap-2">
        <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors font-montserrat">
          <ChevronLeft className="h-4 w-4" /> Volver al Dashboard
        </Link>
        <h1 className="text-2xl font-bold tracking-tight font-montserrat">Análisis de Temperatura</h1>
        <p className="text-sm text-muted-foreground font-montserrat">Estudio térmico de las últimas 24 horas y pronóstico</p>
      </div>

      {/* Cards principales con paddings corregidos */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-background border-border shadow-sm p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase font-montserrat">Actual</span>
            <Thermometer className="h-4 w-4 text-orange-500" />
          </div>
          <div className="mt-2 text-2xl font-extrabold font-mono text-foreground">{Math.round(current.temp)}°C</div>
          <p className="text-[10px] text-muted-foreground mt-1 font-montserrat">Sensación térmica: {Math.round(current.feels_like)}°C</p>
        </Card>

        <Card className="bg-background border-border shadow-sm p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase font-montserrat">Máxima Hoy</span>
            <ArrowUp className="h-4 w-4 text-red-500" />
          </div>
          <div className="mt-2 text-2xl font-extrabold font-mono text-foreground">
            {today ? Math.round(today.temp.max) : "--"}°C
          </div>
          <p className="text-[10px] text-muted-foreground mt-1 font-montserrat">Registrada por la tarde</p>
        </Card>

        <Card className="bg-background border-border shadow-sm p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase font-montserrat">Mínima Hoy</span>
            <ArrowDown className="h-4 w-4 text-sky-500" />
          </div>
          <div className="mt-2 text-2xl font-extrabold font-mono text-foreground">
            {today ? Math.round(today.temp.min) : "--"}°C
          </div>
          <p className="text-[10px] text-muted-foreground mt-1 font-montserrat">Registrada en la madrugada</p>
        </Card>

        <Card className="bg-background border-border shadow-sm p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase font-montserrat">Índice UV</span>
            <Sun className="h-4 w-4 text-yellow-500" />
          </div>
          <div className="mt-2 text-2xl font-extrabold font-mono text-foreground">{current.uvi}</div>
          <p className="text-[10px] text-muted-foreground mt-1 font-montserrat">
            {current.uvi <= 2 ? "Bajo" : current.uvi <= 5 ? "Moderado" : current.uvi <= 7 ? "Alto" : "Muy Alto"}
          </p>
        </Card>
      </div>

      {/* Gráfico 24h */}
      <Card className="bg-background border-border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold font-montserrat">Evolución (Últimas 24 Horas)</CardTitle>
          <CardDescription className="text-xs font-montserrat">Variación térmica horaria registrada en la finca</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-chart-1, #f97316)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--color-chart-1, #f97316)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted/40" />
                <XAxis dataKey="time" className="text-[10px] font-mono" tickLine={false} />
                <YAxis className="text-[10px] font-mono" tickLine={false} unit="°" />
                <Tooltip 
                  contentStyle={{ backgroundColor: "hsl(var(--background))", borderRadius: "8px", borderColor: "hsl(var(--border))" }}
                  labelClassName="text-xs font-semibold font-montserrat"
                  className="font-mono text-xs"
                />
                <Area type="monotone" dataKey="temp" stroke="var(--color-chart-1, #f97316)" strokeWidth={2.5} fillOpacity={1} fill="url(#colorTemp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Grid de Pronóstico 5 días + Datos de Viento y Sol */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Pronóstico Compacto Unificado (Formato Humedad adaptado) */}
        <Card className="md:col-span-2 bg-background border-border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold font-montserrat">Pronóstico Térmico (Próximos 5 Días)</CardTitle>
            <CardDescription className="text-xs font-montserrat">Límites diarios estimados para el confort del pastoreo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {forecastData.map((d, i) => (
                <div key={i} className="flex flex-col items-center justify-center p-3 rounded-lg border border-border bg-muted/20 font-montserrat text-center">
                  <span className="capitalize text-xs font-semibold text-muted-foreground">{d.day}</span>
                  <span className="text-sm font-bold font-mono text-foreground mt-2">
                    {d.max}° <span className="text-muted-foreground font-medium text-[11px]">/ {d.min}°</span>
                  </span>
                  <div className="w-8 h-8 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center mt-2">
                    <Thermometer className="h-4 w-4" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Datos extendidos y Sol */}
        <div className="space-y-6">
          {/* Sol en Horizontal flex-row */}
          <Card className="bg-background border-border shadow-sm p-4">
            <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase font-montserrat mb-3">Luz Solar</p>
            <div className="flex flex-row justify-around items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                  <Sunrise className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-montserrat">Amanecer</p>
                  <p className="font-mono text-sm font-bold text-foreground">
                    {new Date(current.sunrise * 1000).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
                  <Sunset className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-montserrat">Atardecer</p>
                  <p className="font-mono text-sm font-bold text-foreground">
                    {new Date(current.sunset * 1000).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Viento y Otros */}
          <Card className="bg-background border-border shadow-sm p-4">
            <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase font-montserrat mb-3">Condiciones de Viento</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm font-montserrat">
                <span className="text-muted-foreground">Velocidad</span>
                <span className="font-mono font-bold">{current.wind_speed} m/s</span>
              </div>
              <div className="flex items-center justify-between text-sm font-montserrat">
                <span className="text-muted-foreground">Dirección</span>
                <span className="font-mono font-bold flex items-center gap-1">
                  <Compass className="h-3 w-3 text-muted-foreground" />
                  {formatWindDir(current.wind_deg)} ({current.wind_deg}°)
                </span>
              </div>
              <div className="flex items-center justify-between text-sm font-montserrat">
                <span className="text-muted-foreground">Nubosidad</span>
                <span className="font-mono font-bold">{current.clouds}%</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
