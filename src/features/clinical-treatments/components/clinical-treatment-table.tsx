"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DataTable, SpatieQueryParams } from "@/components/data-table";
import { TableActions } from "@/components/ui/table-actions";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { ClinicalTreatment } from "../types";
import { useClinicalTreatmentsList } from "../hooks/useClinicalTreatments";
import { useDeleteClinicalTreatment } from "../hooks/useClinicalTreatments";
import { ClinicalTreatmentFormModal } from "./clinical-treatment-form-modal";
import { ClinicalTreatmentDeleteDialog } from "./clinical-treatment-delete-dialog";

export function ClinicalTreatmentTable() {
  const [params, setParams] = React.useState<SpatieQueryParams>({});
  const [confirmDeleteId, setConfirmDeleteId] = React.useState<number | null>(null);

  // Edit states
  const [editingTreatment, setEditingTreatment] = React.useState<ClinicalTreatment | undefined>(undefined);
  const [isEditOpen, setIsEditOpen] = React.useState(false);

  const { data: response, isLoading } = useClinicalTreatmentsList(params);
  const { mutate: deleteMutate, isPending: isDeleting } = useDeleteClinicalTreatment();

  const columns = React.useMemo<ColumnDef<ClinicalTreatment, any>[]>(() => [
    {
      accessorKey: "code",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-3"
        >
          Código
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-semibold text-neutral-900 dark:text-neutral-100 tracking-wider">
          {row.original.code}
        </div>
      ),
      meta: {
        label: "Código",
      },
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-3"
        >
          Nombre del Tratamiento
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.original.name}</div>,
      meta: {
        label: "Nombre del Tratamiento",
      },
    },
    {
      id: "attributes",
      header: "Propiedades Especiales",
      cell: ({ row }) => {
        const attrs = row.original.attributes;
        if (!attrs || Object.keys(attrs).length === 0) {
          return <span className="text-neutral-400 font-light">—</span>;
        }

        const entries = Object.entries(attrs);

        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-pointer inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
                  {entries.length} {entries.length === 1 ? "propiedad" : "propiedades"}
                </span>
              </TooltipTrigger>
              <TooltipContent className="p-3 max-w-[280px] bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-100 shadow-xl font-montserrat z-50">
                <div className="space-y-1.5">
                  <p className="font-semibold border-b border-neutral-800 pb-1 mb-1.5 text-neutral-300">
                    Especificaciones:
                  </p>
                  {entries.map(([key, val]) => (
                    <div key={key} className="flex justify-between gap-4 text-xs">
                      <span className="text-neutral-400 font-medium capitalize">{key}:</span>
                      <span className="text-neutral-100 font-semibold">{String(val)}</span>
                    </div>
                  ))}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
      meta: {
        label: "Propiedades Especiales",
      },
    },
    {
      id: "acciones",
      enableHiding: false,
      cell: ({ row }) => {
        const treatment = row.original;

        return (
          <TableActions
            actions={[
              {
                label: "Editar Tratamiento",
                icon: Edit,
                onClick: () => {
                  setEditingTreatment(treatment);
                  setIsEditOpen(true);
                },
              },
              {
                label: "Eliminar Registro",
                icon: Trash2,
                variant: "destructive",
                showSeparatorBefore: true,
                onClick: () => setConfirmDeleteId(treatment.id),
              },
            ]}
          />
        );
      },
    },
  ], [setEditingTreatment, setIsEditOpen, setConfirmDeleteId]);

  const treatmentsData = response?.data || [];

  return (
    <>
      <DataTable
        columns={columns}
        data={treatmentsData}
        pageCount={response?.meta?.last_page || 1}
        isLoading={isLoading}
        searchColumnKey="name"
        searchPlaceholder="Buscar por nombre..."
        tableId="clinical-treatments-table-preferences"
        defaultSort="-created_at"
        onStateChange={setParams}
      />

      {/* Edit Form Modal */}
      {isEditOpen && editingTreatment && (
        <ClinicalTreatmentFormModal
          open={isEditOpen}
          onOpenChange={(open) => {
            setIsEditOpen(open);
            if (!open) setEditingTreatment(undefined);
          }}
          initialData={editingTreatment}
        />
      )}

      {/* Delete Dialog */}
      <ClinicalTreatmentDeleteDialog
        isOpen={confirmDeleteId !== null}
        onOpenChange={(open) => !open && setConfirmDeleteId(null)}
        isDeleting={isDeleting}
        onConfirm={() => {
          if (confirmDeleteId) {
            deleteMutate(confirmDeleteId, {
              onSuccess: () => setConfirmDeleteId(null),
            });
          }
        }}
      />
    </>
  );
}
