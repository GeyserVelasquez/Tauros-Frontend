"use client";

import { useMemo, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { 
  Droplets, AlertTriangle, Eye, Compass, Cloud, Sun, Sunrise, Sunset, ChevronLeft, ArrowDown, ArrowUp, HelpCircle 
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWeather } from "../hooks/useWeather";
import { calculateTHI, getTHIStatus } from "../utils/thi";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export function HumidityView() {
  const { data, isLoading, isError, refetch } = useWeather();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  const hourlyData = useMemo(() => {
    if (!data?.hourly) return [];
    return data.hourly.map((h) => {
      const date = new Date(h.dt * 1000);
      return {
        time: date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
        humidity: h.humidity,
        thi: calculateTHI(h.temp, h.humidity),
      };
    });
  }, [data]);

  const forecastData = useMemo(() => {
    if (!data?.daily) return [];
    // Dado que el backend ya excluye el día de hoy, tomamos los primeros 5 elementos del arreglo
    return data.daily.slice(0, 5).map((d) => {
      const date = new Date(d.dt * 1000);
      return {
        day: date.toLocaleDateString("es-ES", { weekday: "short" }),
        humidity: d.humidity,
        min: d.temp.min,
        max: d.temp.max,
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
        <Droplets className="h-12 w-12 text-destructive" />
        <h3 className="font-semibold text-lg font-montserrat">Error al cargar datos de humedad</h3>
        <Button onClick={() => refetch()} variant="outline">Reintentar</Button>
      </div>
    );
  }

  const { current } = data;
  const thi = calculateTHI(current.temp, current.humidity);
  const thiStatus = getTHIStatus(thi);

  // Rangos de humedad a lo largo de los días de pronóstico para obtener máximas y mínimas estimadas
  const humMin = Math.min(...forecastData.map(f => f.humidity), current.humidity);
  const humMax = Math.max(...forecastData.map(f => f.humidity), current.humidity);

  const InfoTHIContent = () => (
    <div className="space-y-4 text-sm font-montserrat">
      <p className="text-muted-foreground text-xs leading-relaxed">
        El <strong>Temperature-Humidity Index (THI)</strong> es una métrica clave usada en ganadería bovina para evaluar el estrés térmico. A partir de un THI de <strong>72</strong>, los animales sufren reducción de apetito, menor producción de leche y riesgos reproductivos.
      </p>
      <div className="space-y-2 mt-2">
        <div className="flex items-center justify-between p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
          <span className="font-semibold">Normal (&lt; 72)</span>
          <span className="text-xs">Sin estrés térmico</span>
        </div>
        <div className="flex items-center justify-between p-2 rounded bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
          <span className="font-semibold">Alerta (72 - 78)</span>
          <span className="text-xs">Jadeo leve y sudoración</span>
        </div>
        <div className="flex items-center justify-between p-2 rounded bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400">
          <span className="font-semibold">Peligro (79 - 88)</span>
          <span className="text-xs">Pérdida productiva severa</span>
        </div>
        <div className="flex items-center justify-between p-2 rounded bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400">
          <span className="font-semibold">Emergencia (&gt; 88)</span>
          <span className="text-xs font-bold animate-pulse">Peligro vital</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Volver y Header */}
      <div className="flex flex-col gap-2">
        <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors font-montserrat">
          <ChevronLeft className="h-4 w-4" /> Volver al Dashboard
        </Link>
        <h1 className="text-2xl font-bold tracking-tight font-montserrat">Análisis de Humedad</h1>
        <p className="text-sm text-muted-foreground font-montserrat">Estudio de humedad relativa y confort calórico del ganado</p>
      </div>

      {/* Cards principales corregidas al estado original (Humedad, THI con Badge, Punto de rocío y Nubosidad) */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Humedad Actual */}
        <Card className="bg-background border-border shadow-sm p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase font-montserrat">Humedad Actual</span>
            <Droplets className="h-4 w-4 text-sky-500" />
          </div>
          <div className="mt-2 text-2xl font-extrabold font-mono text-foreground">{current.humidity}%</div>
          <p className="text-[10px] text-muted-foreground mt-1 font-montserrat">Humedad relativa del aire</p>
        </Card>

        {/* Card 2: Estrés Térmico (THI) */}
        <Card className="bg-background border-border shadow-sm p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase font-montserrat">Estrés Térmico (THI)</span>
            
            {/* Modal/Drawer Trigger Responsivo */}
            {isMobile ? (
              <Drawer open={isOpen} onOpenChange={setIsOpen}>
                <DrawerTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full text-muted-foreground hover:text-foreground">
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="p-6">
                  <DrawerHeader className="text-left pb-2 px-0">
                    <DrawerTitle className="font-montserrat font-bold flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-500" /> Estrés Térmico (THI)
                    </DrawerTitle>
                    <DrawerDescription className="font-montserrat">Tabla de rangos de confort bovino</DrawerDescription>
                  </DrawerHeader>
                  <InfoTHIContent />
                  <DrawerFooter className="pt-4 px-0">
                    <DrawerClose asChild>
                      <Button variant="outline" className="w-full">Entendido</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            ) : (
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full text-muted-foreground hover:text-foreground">
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md font-montserrat">
                  <DialogHeader className="pb-2">
                    <DialogTitle className="font-bold flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-500" /> Estrés Térmico (THI)
                    </DialogTitle>
                    <DialogDescription>Tabla de rangos de confort para ganado bovino</DialogDescription>
                  </DialogHeader>
                  <InfoTHIContent />
                </DialogContent>
              </Dialog>
            )}
          </div>
          <div className="mt-2 text-2xl font-extrabold font-mono text-foreground flex items-center justify-between">
            {thi}
            <Badge variant="outline" className={`font-montserrat text-[9px] font-bold py-0.5 px-2 ${thiStatus.className}`}>
              {thiStatus.label}
            </Badge>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1 font-montserrat">Índice Temperatura-Humedad</p>
        </Card>

        {/* Card 3: Punto de Rocío */}
        <Card className="bg-background border-border shadow-sm p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase font-montserrat">Punto de Rocío</span>
            <Compass className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-extrabold font-mono text-foreground">{Math.round(current.dew_point)}°C</div>
          <p className="text-[10px] text-muted-foreground mt-1 font-montserrat">Condensación de vapor de agua</p>
        </Card>

        {/* Card 4: Nubosidad */}
        <Card className="bg-background border-border shadow-sm p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase font-montserrat">Nubosidad</span>
            <Cloud className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-2 text-2xl font-extrabold font-mono text-foreground">{current.clouds}%</div>
          <p className="text-[10px] text-muted-foreground mt-1 font-montserrat">Cielo cubierto</p>
        </Card>
      </div>

      {/* Gráficos de Evolución de Humedad y THI en las últimas 24 Horas */}
      <Card className="bg-background border-border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold font-montserrat">Evolución de Humedad Relativa y THI (Últimas 24 Horas)</CardTitle>
          <CardDescription className="text-xs font-montserrat">Comportamiento horario de humedad relativa (%) en la finca</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHumidity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-chart-2, #3b82f6)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--color-chart-2, #3b82f6)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted/40" />
                <XAxis dataKey="time" className="text-[10px] font-mono" tickLine={false} />
                <YAxis className="text-[10px] font-mono" tickLine={false} unit="%" />
                <Tooltip 
                  contentStyle={{ backgroundColor: "hsl(var(--background))", borderRadius: "8px", borderColor: "hsl(var(--border))" }}
                  labelClassName="text-xs font-semibold font-montserrat"
                  className="font-mono text-xs"
                />
                <Area type="monotone" dataKey="humidity" stroke="var(--color-chart-2, #3b82f6)" strokeWidth={2.5} fillOpacity={1} fill="url(#colorHumidity)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Grid de Pronóstico 5 días + Dos cards separadas a la derecha para emparejar con Temperatura */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Pronóstico Humedad a 5 Días (Grid de 5 columnas, estilo unificado) */}
        <Card className="md:col-span-2 bg-background border-border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold font-montserrat">Humedad Diaria Pronosticada</CardTitle>
            <CardDescription className="text-xs font-montserrat">Humedad promedio estimada para los próximos 5 días</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {forecastData.map((d, i) => (
                <div key={i} className="flex flex-col items-center justify-center p-3 rounded-lg border border-border bg-muted/20 font-montserrat text-center">
                  <span className="capitalize text-xs font-semibold text-muted-foreground">{d.day}</span>
                  <span className="text-lg font-bold font-mono text-foreground mt-2">{d.humidity}%</span>
                  <div className="w-8 h-8 rounded-full bg-sky-500/10 text-sky-500 flex items-center justify-center mt-2">
                    <Droplets className="h-4 w-4" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sección de la derecha: Dividida en dos cards separadas apiladas verticalmente */}
        <div className="space-y-6">
          {/* Card 1: Límites del período */}
          <Card className="bg-background border-border shadow-sm p-4">
            <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase font-montserrat mb-3">Límites del Período</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm font-montserrat">
                <span className="text-muted-foreground">Humedad Máxima</span>
                <span className="font-mono font-bold">{humMax}%</span>
              </div>
              <div className="flex items-center justify-between text-sm font-montserrat">
                <span className="text-muted-foreground">Humedad Mínima</span>
                <span className="font-mono font-bold">{humMin}%</span>
              </div>
            </div>
          </Card>

          {/* Card 2: Diagnóstico y transpiración */}
          <Card className="bg-background border-border shadow-sm p-4">
            <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase font-montserrat mb-3">Confort e Hidratación</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm font-montserrat">
                <span className="text-muted-foreground">Condensación</span>
                <span className="font-mono font-bold">{Math.round(current.dew_point)}°C</span>
              </div>
              <div className="flex items-center justify-between text-sm font-montserrat">
                <span className="text-muted-foreground">Secado de Potrero</span>
                <span className="font-mono font-bold text-xs text-primary bg-primary/5 px-2 py-0.5 rounded">
                  {current.clouds >= 70 ? "Lento" : current.humidity >= 80 ? "Moderado" : "Rápido"}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
