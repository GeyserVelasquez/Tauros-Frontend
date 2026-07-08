"use client";

import { Cell, Pie, PieChart } from "recharts";
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
import { ReproductiveStat, REPRODUCTIVE_STATUS_LABELS } from "../types";

interface ReproductiveStatusChartProps {
  data: ReproductiveStat[];
}

const STATUS_COLORS: Record<string, string> = {
  pregnant: "var(--color-chart-1)",
  heat: "var(--color-chart-6)",
  empty: "var(--color-chart-7)",
  waiting: "var(--color-chart-4)",
};

export function ReproductiveStatusChart({ data }: ReproductiveStatusChartProps) {
  const chartData = data.map((item) => {
    const label = REPRODUCTIVE_STATUS_LABELS[item.status] || item.status;
    const fill = STATUS_COLORS[item.status] || "var(--color-chart-3)";
    return {
      ...item,
      label,
      fill,
    };
  });

  const chartConfig = data.reduce((acc, item) => {
    const label = REPRODUCTIVE_STATUS_LABELS[item.status] || item.status;
    acc[item.status] = { label };
    return acc;
  }, {} as ChartConfig);

  const totalCows = data.reduce((sum, item) => sum + item.count, 0);

  if (totalCows === 0) {
    return (
      <Card className="flex flex-col justify-between h-[480px] bg-background border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold tracking-tight text-foreground font-montserrat">Estado Reproductivo (Vacas)</CardTitle>
          <CardDescription className="text-xs text-muted-foreground font-montserrat">Situación de reproducción en hembras aptas</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 items-center justify-center text-sm font-semibold tracking-wide text-muted-foreground font-montserrat">
          No hay vacas registradas para estadísticas reproductivas.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col justify-between h-[480px] bg-background border-border shadow-sm">
      <CardHeader className="pb-0">
        <CardTitle className="text-lg font-bold tracking-tight text-foreground font-montserrat">Estado Reproductivo (Vacas)</CardTitle>
        <CardDescription className="text-xs text-muted-foreground font-montserrat">Situación de reproducción en hembras aptas</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between pb-6 pt-4">
        <ChartContainer
          config={chartConfig}
          className="mx-auto w-full aspect-auto h-[280px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="status" />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="status"
              innerRadius={70}
              strokeWidth={3}
              outerRadius={95}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} className="stroke-background hover:opacity-90 transition-opacity duration-200" />
              ))}
            </Pie>
          </PieChart>
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
