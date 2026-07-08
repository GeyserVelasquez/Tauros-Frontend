"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DataTable, SpatieQueryParams } from "@/components/data-table";
import { TableActions } from "@/components/ui/table-actions";

import { AnimalOutcome, OUTCOME_TYPE_LABELS, OUTCOME_TYPE_OPTIONS } from "../types";
import { useAnimalOutcomesList } from "../hooks/useOutcomes";
import { useDeleteAnimalOutcome } from "../hooks/useMutateOutcomes";
import { OutcomeDeleteDialog } from "./outcome-delete-dialog";

export function OutcomeTable() {
  const [params, setParams] = React.useState<SpatieQueryParams>({});
  
  // Queries y Mutaciones
  const { data: paginatedData, isLoading, error } = useAnimalOutcomesList(params);
  const { mutate: deleteOutcome, isPending: isDeleting } = useDeleteAnimalOutcome();

  // Modal confirmación eliminación
  const [confirmDeleteId, setConfirmDeleteId] = React.useState<number | null>(null);

  // Setup filtros
  const filterFields = React.useMemo(() => [
    {
      id: "outcome_type",
      placeholder: "Todos los tipos",
      options: OUTCOME_TYPE_OPTIONS,
    },
  ], []);

  const columns: ColumnDef<AnimalOutcome, any>[] = React.useMemo(() => [
    {
      accessorKey: "made_at",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-3 font-montserrat"
        >
          Fecha de Salida
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const rawDate = row.getValue("made_at") as string;
        const formattedDate = rawDate ? rawDate.split("T")[0] : "—";
        return <div className="font-medium font-montserrat">{formattedDate}</div>;
      },
      meta: {
        label: "Fecha",
      },
    },
    {
      id: "livestock.brand_number",
      header: "Animal (Marca/Arete)",
      cell: ({ row }) => {
        const animal = row.original.livestock;
        return (
          <div className="font-semibold tracking-wider font-montserrat">
            {animal ? `${animal.brand_number} ${animal.name ? `- ${animal.name}` : ""}` : "—"}
          </div>
        );
      },
      meta: {
        label: "Animal",
      },
    },
    {
      id: "outcome_type",
      header: "Tipo de Salida",
      cell: ({ row }) => {
        const type = row.original.outcome_type;
        return <div className="font-montserrat">{OUTCOME_TYPE_LABELS[type] || type}</div>;
      },
      meta: {
        label: "Tipo",
      },
    },
    {
      id: "death_cause",
      header: "Causa de Muerte",
      cell: ({ row }) => {
        const cause = row.original.death_cause;
        return <div className="font-montserrat">{cause?.name || "—"}</div>;
      },
      meta: {
        label: "Causa de Muerte",
      },
    },
    {
      id: "acciones",
      enableHiding: false,
      cell: ({ row }) => {
        const outcome = row.original;

        return (
          <TableActions
            actions={[
              {
                label: "Revertir Salida",
                icon: Trash2,
                variant: "destructive",
                onClick: () => setConfirmDeleteId(outcome.id),
              },
            ]}
          />
        );
      },
    },
  ], [setConfirmDeleteId]);

  if (error) {
    return (
      <div className="p-8 text-center font-montserrat text-red-500">
        Error al cargar el registro de salidas. Por favor, intente nuevamente.
      </div>
    );
  }

  const outcomesData = paginatedData?.data || [];

  return (
    <>
      <DataTable
        columns={columns}
        data={outcomesData}
        pageCount={paginatedData?.meta?.last_page || 1}
        isLoading={isLoading}
        searchColumnKey="livestock.brand_number"
        searchPlaceholder="Buscar por animal..."
        tableId="outcomes-table-preferences"
        defaultSort="-created_at"
        defaultIncludes={["livestock", "deathCause"]}
        filterFields={filterFields}
        onStateChange={setParams}
      />

      {/* Modal de Confirmación de Eliminación */}
      <OutcomeDeleteDialog
        isOpen={confirmDeleteId !== null}
        onOpenChange={(open) => !open && setConfirmDeleteId(null)}
        isDeleting={isDeleting}
        onConfirm={() => {
          if (confirmDeleteId) {
            deleteOutcome(confirmDeleteId, {
              onSuccess: () => setConfirmDeleteId(null),
            });
          }
        }}
      />
    </>
  );
}
