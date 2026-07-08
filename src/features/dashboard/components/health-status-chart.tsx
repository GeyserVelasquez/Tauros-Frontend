"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { HealthStat } from "../types";
import { STATE_LABELS, State } from "@/features/livestock/types";

interface HealthStatusChartProps {
  data: HealthStat[];
}

const STATE_COLORS: Record<string, string> = {
  healthy: "var(--color-chart-1)",
  sick: "var(--color-chart-2)",
  treatment: "var(--color-chart-3)",
  quarantine: "var(--color-chart-4)",
};

export function HealthStatusChart({ data }: HealthStatusChartProps) {
  const chartData = data.map((item) => {
    const label = STATE_LABELS[item.category as State] || item.category;
    const fill = STATE_COLORS[item.category] || "var(--color-chart-2)";
    return {
      ...item,
      label,
      fill,
    };
  });

  const chartConfig = data.reduce((acc, item) => {
    const label = STATE_LABELS[item.category as State] || item.category;
    acc[item.category] = { label };
    return acc;
  }, {} as ChartConfig);

  const totalAnimals = data.reduce((sum, item) => sum + item.count, 0);

  if (totalAnimals === 0) {
    return (
      <Card className="flex flex-col justify-between h-[480px] bg-background border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold tracking-tight text-foreground font-montserrat">Estado de Salud</CardTitle>
          <CardDescription className="text-xs text-muted-foreground font-montserrat">Distribución de salud del ganado vivo</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 items-center justify-center text-sm font-semibold tracking-wide text-muted-foreground font-montserrat">
          No hay animales registrados.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col justify-between h-[480px] bg-background border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-bold tracking-tight text-foreground font-montserrat">Estado de Salud</CardTitle>
        <CardDescription className="text-xs text-muted-foreground font-montserrat">Distribución de salud del ganado vivo</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between pb-6 pt-4">
        <ChartContainer
          config={chartConfig}
          className="mx-auto w-full aspect-auto h-[280px]"
        >
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/40" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-[11px] fill-muted-foreground font-semibold font-montserrat tracking-wide"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              allowDecimals={false}
              className="text-[11px] fill-muted-foreground font-bold font-mono"
            />
            <ChartTooltip
              cursor={{ fill: "rgba(0, 0, 0, 0.04)" }}
              content={<ChartTooltipContent hideLabel nameKey="category" />}
            />
            <Bar
              dataKey="count"
              radius={[4, 4, 0, 0]}
              maxBarSize={45}
            />
          </BarChart>
        </ChartContainer>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs font-montserrat font-semibold tracking-wide text-foreground mt-4 px-2">
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-[3px] shrink-0 border border-black/10 dark:border-white/10"
                style={{ backgroundColor: item.fill }}
              />
              <span className="truncate">
                {item.label}: <strong className="text-foreground font-mono font-bold">{item.count}</strong> <span className="text-[10px] text-muted-foreground">({item.percentage}%)</span>
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
