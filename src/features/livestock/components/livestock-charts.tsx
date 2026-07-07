"use client";

import * as React from "react";
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { Scale, Milk, Calendar, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

import { useGrowthsList } from "@/features/growths/hooks/useGrowths";
import { useMilkingsList } from "@/features/milkings/hooks/useMilkings";
import { isFemaleCategory } from "../types";
import { formatTemporalData } from "../utils/chart-helpers";

interface LivestockChartsProps {
  id: string | number;
  category: string;
}

type TimeFilter = "month" | "year" | "all";

export function LivestockCharts({ id, category }: LivestockChartsProps) {
  const [filter, setFilter] = React.useState<TimeFilter>("month");
  const isFemale = isFemaleCategory(category);

  // Queries
  const { data: growthsResponse, isLoading: isLoadingGrowths, error: errorGrowths } = useGrowthsList({
    "filter[livestock_id]": id,
    sort: "made_at",
    per_page: 500,
  });

  const { data: milkingsResponse, isLoading: isLoadingMilkings, error: errorMilkings } = useMilkingsList({
    "filter[livestock_id]": id,
    sort: "made_at",
    per_page: 500,
  });

  const growths = growthsResponse?.data || [];
  const milkings = milkingsResponse?.data || [];

  const hasGrowths = growths.length >= 10;
  const hasMilkings = milkings.length >= 10;

  // Transform growths data
  const processedGrowths = React.useMemo(() => {
    if (!hasGrowths) return [];
    const formatted = formatTemporalData(
      growths.map((g) => ({ made_at: g.made_at, value: Number(g.weight) })),
      filter
    );
    return formatted.map((d) => ({
      dateLabel: d.date.toLocaleDateString("es-ES", { day: "2-digit", month: "short" }),
      fullDate: d.date.toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" }),
      Peso: Number(Number(d.value).toFixed(2)),
      isFake: d.isFake,
    }));
  }, [growths, filter, hasGrowths]);

  // Transform milkings data
  const processedMilkings = React.useMemo(() => {
    if (!hasMilkings) return [];
    const formatted = formatTemporalData(
      milkings.map((m) => ({
        made_at: m.made_at,
        value: Number(m.first_weight || 0) + Number(m.second_weight || 0) + Number(m.third_weight || 0),
      })),
      filter
    );
    return formatted.map((d) => ({
      dateLabel: d.date.toLocaleDateString("es-ES", { day: "2-digit", month: "short" }),
      fullDate: d.date.toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" }),
      Leche: Number(Number(d.value).toFixed(2)),
      isFake: d.isFake,
    }));
  }, [milkings, filter, hasMilkings]);

  const isLoading = isLoadingGrowths || (isFemale && isLoadingMilkings);
  const isError = errorGrowths || (isFemale && errorMilkings);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center">
          <Skeleton className="h-10 w-[300px] rounded-full" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Skeleton className="h-[350px] w-full rounded-3xl" />
          {isFemale && <Skeleton className="h-[350px] w-full rounded-3xl" />}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-3xl border border-destructive/50 bg-destructive/10 p-4 text-destructive font-montserrat text-sm flex items-start gap-3">
        <Info className="h-5 w-5 shrink-0 mt-0.5" />
        <div>
          <h5 className="font-bold tracking-tight">Error al cargar estadísticas</h5>
          <p className="mt-1 text-xs text-destructive/90 leading-relaxed">
            Hubo un problema de conexión al cargar los registros del animal. Por favor, intente recargar la página.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Selector de Rango Temporal */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-full bg-muted p-1 border border-border/50">
          {(["month", "year", "all"] as TimeFilter[]).map((type) => (
            <Button
              key={type}
              variant={filter === type ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter(type)}
              className="rounded-full px-4 text-xs font-semibold"
            >
              {type === "month" ? "Mes Actual" : type === "year" ? "Año Actual" : "Historial"}
            </Button>
          ))}
        </div>
      </div>

      {/* Grid de Gráficos */}
      <div className={`grid grid-cols-1 gap-6 ${isFemale ? "md:grid-cols-2" : "w-full"}`}>
        {/* Gráfico de Crecimiento */}
        <Card className="shadow-xs border-border bg-background">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Scale className="h-5 w-5 text-primary opacity-85" />
              Curva de Crecimiento
            </CardTitle>
            <CardDescription>Evolución del peso corporal (Kg) en función del tiempo</CardDescription>
          </CardHeader>
          <CardContent className="h-[320px]">
            {hasGrowths ? (
              <ChartContainer config={{ Peso: { label: "Peso", color: "var(--color-chart-1)" } }} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={processedGrowths} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" className="opacity-50" />
                    <XAxis
                      dataKey="dateLabel"
                      stroke="var(--muted-foreground)"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      dy={10}
                    />
                    <YAxis
                      stroke="var(--muted-foreground)"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      dx={-10}
                    />
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (!active || !payload || !payload.length) return null;
                        const data = payload[0].payload;
                        return (
                          <div className="rounded-2xl border border-border bg-popover p-3 shadow-md text-xs font-montserrat">
                            <p className="text-muted-foreground font-medium">{data.fullDate}</p>
                            <p className="text-foreground mt-1 font-semibold flex items-center gap-1.5">
                              <span className="h-2 w-2 rounded-full bg-primary" />
                              Peso: <span className="font-mono font-bold">{payload[0].value} Kg</span>
                            </p>
                            {data.isFake && (
                              <span className="text-[10px] text-amber-500 font-medium mt-1.5 block">
                                * Período sin registros (valor estimado)
                              </span>
                            )}
                          </div>
                        );
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="Peso"
                      stroke="var(--primary)"
                      strokeWidth={2.5}
                      dot={({ cx, cy, payload, index }) => {
                        if (payload.isFake) return null;
                        return (
                          <circle
                            key={`dot-${index}`}
                            cx={cx}
                            cy={cy}
                            r={4}
                            fill="var(--background)"
                            stroke="var(--primary)"
                            strokeWidth={2}
                          />
                        );
                      }}
                      activeDot={{ r: 6, strokeWidth: 0, fill: "var(--primary)" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-center p-6">
                <Scale className="h-10 w-10 text-muted-foreground opacity-50 mb-3" />
                <p className="text-sm font-semibold text-muted-foreground">
                  Registros insuficientes
                </p>
                <p className="text-xs text-muted-foreground max-w-xs mt-1 leading-relaxed">
                  Se requieren al menos 10 registros históricos en total para generar la curva de crecimiento. (Actual: {growths.length})
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Gráfico de Ordeño */}
        {isFemale && (
          <Card className="shadow-xs border-border bg-background">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Milk className="h-5 w-5 text-primary opacity-85" />
                Producción de Leche
              </CardTitle>
              <CardDescription>Rendimiento diario total de ordeño (Kg) vs Tiempo</CardDescription>
            </CardHeader>
            <CardContent className="h-[320px]">
              {hasMilkings ? (
                <ChartContainer config={{ Leche: { label: "Leche", color: "var(--color-chart-2)" } }} className="h-full w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={processedMilkings} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" className="opacity-50" />
                      <XAxis
                        dataKey="dateLabel"
                        stroke="var(--muted-foreground)"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        dy={10}
                      />
                      <YAxis
                        stroke="var(--muted-foreground)"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        dx={-10}
                      />
                      <ChartTooltip
                        content={({ active, payload }) => {
                          if (!active || !payload || !payload.length) return null;
                          const data = payload[0].payload;
                          return (
                            <div className="rounded-2xl border border-border bg-popover p-3 shadow-md text-xs font-montserrat">
                              <p className="text-muted-foreground font-medium">{data.fullDate}</p>
                              <p className="text-foreground mt-1 font-semibold flex items-center gap-1.5">
                                <span className="h-2 w-2 rounded-full bg-chart-2" />
                                Leche: <span className="font-mono font-bold">{payload[0].value} Kg</span>
                              </p>
                              {data.isFake && (
                                <span className="text-[10px] text-amber-500 font-medium mt-1.5 block">
                                  * Período sin registros (valor estimado)
                                </span>
                              )}
                            </div>
                          );
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="Leche"
                        stroke="var(--color-chart-2)"
                        strokeWidth={2.5}
                        dot={({ cx, cy, payload, index }) => {
                          if (payload.isFake) return null;
                          return (
                            <circle
                              key={`dot-${index}`}
                              cx={cx}
                              cy={cy}
                              r={4}
                              fill="var(--background)"
                              stroke="var(--color-chart-2)"
                              strokeWidth={2}
                            />
                          );
                        }}
                        activeDot={{ r: 6, strokeWidth: 0, fill: "var(--color-chart-2)" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-center p-6">
                  <Milk className="h-10 w-10 text-muted-foreground opacity-50 mb-3" />
                  <p className="text-sm font-semibold text-muted-foreground">
                    Registros insuficientes
                  </p>
                  <p className="text-xs text-muted-foreground max-w-xs mt-1 leading-relaxed">
                    Se requieren al menos 10 registros históricos en total para generar la curva de ordeño. (Actual: {milkings.length})
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
