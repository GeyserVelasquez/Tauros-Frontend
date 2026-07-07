"use client";

import Link from "next/link";
import { Thermometer, Droplets, ArrowUpRight, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useWeather } from "../hooks/useWeather";
import { calculateTHI, getTHIStatus } from "../utils/thi";

export function WeatherCards() {
  const { data, isLoading, isError } = useWeather();

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <div className="h-32 rounded-xl bg-background border border-border animate-pulse" />
        <div className="h-32 rounded-xl bg-background border border-border animate-pulse" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex items-center gap-2 p-4 rounded-xl border border-destructive/20 bg-destructive/5 text-destructive text-sm font-montserrat">
        <AlertTriangle className="h-5 w-5 shrink-0" />
        <span>No se pudieron cargar los datos del clima. Verifica la configuración o la conexión.</span>
      </div>
    );
  }

  const { current, daily } = data;
  const today = daily[0];
  const tempMin = today ? Math.round(today.temp.min) : Math.round(current.temp - 3);
  const tempMax = today ? Math.round(today.temp.max) : Math.round(current.temp + 4);

  const thi = calculateTHI(current.temp, current.humidity);
  const thiStatus = getTHIStatus(thi);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* CARD DE TEMPERATURA */}
      <Card className="relative overflow-hidden bg-background border-border shadow-sm hover:shadow-md transition-shadow group">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-semibold tracking-wider text-muted-foreground uppercase font-montserrat">
            Temperatura
          </CardTitle>
          <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
            <Thermometer className="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-foreground font-mono">
              {Math.round(current.temp)}°C
            </span>
            <span className="text-xs text-muted-foreground font-montserrat">
              Sensación: {Math.round(current.feels_like)}°C
            </span>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="text-xs text-muted-foreground font-montserrat">
              Hoy: <span className="font-mono font-bold text-foreground">{tempMin}°C</span> /{" "}
              <span className="font-mono font-bold text-foreground">{tempMax}°C</span>
            </div>
            <Link
              href="/dashboard/weather/temperature"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline font-montserrat group/link"
            >
              Historial 24h
              <ArrowUpRight className="h-3 w-3 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* CARD DE HUMEDAD Y THI */}
      <Card className="relative overflow-hidden bg-background border-border shadow-sm hover:shadow-md transition-shadow group">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-semibold tracking-wider text-muted-foreground uppercase font-montserrat">
            Humedad y Estrés Calórico
          </CardTitle>
          <div className="p-2 rounded-lg bg-sky-500/10 text-sky-500">
            <Droplets className="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-foreground font-mono">
                {current.humidity}%
              </span>
              <span className="text-xs text-muted-foreground font-montserrat">
                THI: <span className="font-mono font-bold text-foreground">{thi}</span>
              </span>
            </div>
            <Badge variant="outline" className={`font-montserrat text-[10px] font-bold ${thiStatus.className}`}>
              {thiStatus.label}
            </Badge>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="text-xs text-muted-foreground font-montserrat">
              Punto de rocío: <span className="font-mono font-bold text-foreground">{Math.round(current.dew_point)}°C</span>
            </div>
            <Link
              href="/dashboard/weather/humidity"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline font-montserrat group/link"
            >
              Historial 24h
              <ArrowUpRight className="h-3 w-3 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
