"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit, Trash2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DataTable, SpatieQueryParams } from "@/components/data-table";
import { TableActions } from "@/components/ui/table-actions";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

import { ClinicHistory } from "../types";
import { useClinicHistoriesList, useDeleteClinicHistory } from "../hooks/useClinicHistories";

const DEFAULT_INCLUDES = ["livestock", "technician", "clinicDiagnostics", "clinicalTreatments", "treatmentApplications"];

export function ClinicHistoryTable() {
  const router = useRouter();
  const [params, setParams] = React.useState<SpatieQueryParams>({
    include: DEFAULT_INCLUDES.join(","),
  });

  const { data: response, isLoading } = useClinicHistoriesList(params);
  const deleteMutation = useDeleteClinicHistory();

  const handleOpenCreate = () => {
    router.push("/dashboard/health/clinic-histories/create");
  };

  const handleOpenEdit = (history: ClinicHistory) => {
    router.push(`/dashboard/health/clinic-histories/${history.id}/edit`);
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Está seguro de que desea eliminar este registro médico?")) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        // Handled by mutation
      }
    }
  };

  const columns = React.useMemo<ColumnDef<ClinicHistory, any>[]>(() => [
    {
      accessorKey: "code",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-3 font-semibold"
        >
          Código
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <span className="font-mono font-semibold">{row.original.code}</span>,
      meta: { label: "Código" },
    },
    {
      accessorKey: "name",
      header: "Título / Motivo",
      cell: ({ row }) => <span className="font-semibold">{row.original.name}</span>,
      meta: { label: "Título / Motivo" },
    },
    {
      id: "livestock.code",
      header: "Animal",
      cell: ({ row }) => {
        const animal = row.original.livestock;
        return animal ? (
          <span className="font-semibold tracking-wider">{animal.code} {animal.name ? `- ${animal.name}` : ""}</span>
        ) : (
          "—"
        );
      },
    },
    {
      id: "diagnostics",
      header: "Diagnósticos",
      cell: ({ row }) => {
        const diags = row.original.clinic_diagnostics || [];
        if (diags.length === 0) return <span className="text-muted-foreground text-xs">Ninguno</span>;
        
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="cursor-pointer font-semibold text-xs py-0.5">
                  {diags.length} {diags.length === 1 ? "diagnóstico" : "diagnósticos"}
                </Badge>
              </TooltipTrigger>
              <TooltipContent className="w-80 font-montserrat p-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Diagnósticos Encontrados</h4>
                <ul className="space-y-1 text-xs">
                  {diags.map((d) => (
                    <li key={d.id} className="border-b last:border-0 pb-1 font-semibold text-neutral-800 dark:text-neutral-200">
                      {d.code} - {d.name}
                    </li>
                  ))}
                </ul>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
    },
    {
      id: "treatments",
      header: "Tratamientos / Insumos",
      cell: ({ row }) => {
        const treats = row.original.clinical_treatments || [];
        const apps = row.original.treatment_applications || [];
        if (treats.length === 0) return <span className="text-muted-foreground text-xs">Ninguno</span>;

        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="secondary" className="cursor-pointer font-semibold text-xs py-0.5">
                  {treats.length} {treats.length === 1 ? "tratamiento" : "tratamientos"}
                </Badge>
              </TooltipTrigger>
              <TooltipContent className="w-80 font-montserrat p-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Prescripción de Tratamientos</h4>
                <ul className="space-y-2 text-xs">
                  {apps.map((app) => {
                    const treatmentName = row.original.clinical_treatments?.find(t => t.id === app.clinical_treatment_id)?.name || "Tratamiento";
                    return (
                      <li key={app.id} className="border-b last:border-0 pb-1.5 flex flex-col">
                        <span className="font-bold text-neutral-800 dark:text-neutral-200">{treatmentName}</span>
                        {app.supply_id && (
                          <span className="text-muted-foreground text-[10px]">
                            Insumo: {app.quantity_formatted} unidades de {app.supply_id}
                          </span>
                        )}
                        {app.dose_number && (
                          <span className="text-primary text-[10px] font-semibold">
                            Dosis #{app.dose_number} (Frecuencia activa)
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Fecha Registro",
      cell: ({ row }) => {
        const dateStr = row.original.created_at;
        return dateStr ? new Date(dateStr).toLocaleDateString("es-ES") : "—";
      },
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => (
        <TableActions
          actions={[
            {
              label: "Editar",
              icon: Edit,
              onClick: () => handleOpenEdit(row.original),
            },
            {
              label: "Eliminar",
              icon: Trash2,
              variant: "destructive",
              onClick: () => handleDelete(row.original.id),
              showSeparatorBefore: true,
            },
          ]}
        />
      ),
    },
  ], []);

  return (
    <div className="font-montserrat space-y-4">
      {/* Action Header */}
      <div className="flex justify-between items-center bg-white dark:bg-neutral-900 p-4 border rounded-lg border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Historias Clínicas</h1>
          <p className="text-sm text-muted-foreground">Registre y administre las consultas médicas, diagnósticos y tratamientos veterinarios.</p>
        </div>
        <Button onClick={handleOpenCreate} className="active:scale-95 transition-transform flex items-center gap-1">
          <Plus className="h-4 w-4" /> Registrar Consulta
        </Button>
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-neutral-900 border rounded-lg p-4 border-neutral-200 dark:border-neutral-800 shadow-sm">
        <DataTable
          columns={columns as any}
          data={response?.data || []}
          pageCount={response?.meta?.last_page || 1}
          isLoading={isLoading}
          searchColumnKey="name"
          searchPlaceholder="Buscar por motivo..."
          tableId="clinic-histories-table-preferences"
          defaultSort="-created_at"
          defaultIncludes={DEFAULT_INCLUDES}
          onStateChange={setParams}
        />
      </div>
    </div>
  );
}
