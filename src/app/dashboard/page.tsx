"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useDashboardStats,
  CategoryDistributionChart,
  HealthStatusChart,
  ReproductiveStatusChart,
} from "@/features/dashboard";

function ChartSkeleton() {
  return (
    <div className="flex flex-col justify-between h-[480px] p-6 border border-border rounded-xl bg-background shadow-sm animate-pulse">
      <div className="space-y-2">
        <div className="h-4 w-1/3 bg-muted" />
        <div className="h-3 w-1/2 bg-muted" />
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="h-32 w-32 rounded-full border-8 border-muted" />
      </div>
      <div className="flex justify-center gap-2">
        <div className="h-3 w-12 bg-muted" />
        <div className="h-3 w-12 bg-muted" />
      </div>
    </div>
  );
}

export default function Page() {
  const { data, isLoading, isError, refetch, isRefetching } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-6 pt-0">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground font-montserrat">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Cargando resumen de las estadísticas de la finca...</p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <ChartSkeleton />
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center min-h-[400px] gap-4 p-6 text-center">
        <div className="p-3 rounded-full bg-destructive/10 text-destructive">
          <AlertCircle className="h-10 w-10" />
        </div>
        <div className="space-y-2 max-w-sm">
          <h3 className="font-semibold text-lg text-foreground">Error al cargar estadísticas</h3>
          <p className="text-sm text-muted-foreground">
            No se pudo establecer conexión con el servidor. Por favor, verifica tu conexión a internet e inténtalo de nuevo.
          </p>
        </div>
        <Button onClick={() => refetch()} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" /> Reintentar
        </Button>
      </div>
    );
  }

  const stats = data?.data;

  return (
    <div className="flex flex-1 flex-col gap-4 p-6 pt-0">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-montserrat">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Resumen general de las estadísticas de la finca</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => refetch()}
          disabled={isRefetching}
          className="text-muted-foreground hover:text-foreground"
          title="Actualizar datos"
        >
          <RefreshCw className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`} />
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <CategoryDistributionChart data={stats?.category_distribution || []} />
        <HealthStatusChart data={stats?.health_status || []} />
        <ReproductiveStatusChart data={stats?.reproductive_status_distribution || []} />
      </div>
    </div>
  );
}
