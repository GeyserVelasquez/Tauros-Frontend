"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DataTable, SpatieQueryParams } from "@/components/data-table";
import { TableActions } from "@/components/ui/table-actions";

import { Extraction, SemenBatch, EmbrionBatch } from "../types";
import { useExtractionsList } from "../hooks/useExtractions";
import { useDeleteExtraction, useUpdateExtraction } from "../hooks/useMutateExtractions";
import { ExtractionFormModal } from "./extraction-form-modal";
import { ExtractionDeleteDialog } from "./extraction-delete-dialog";

export function ExtractionTable() {
  const [params, setParams] = React.useState<SpatieQueryParams>({});
  const [confirmDeleteId, setConfirmDeleteId] = React.useState<number | null>(null);

  // States for modal editing on same page
  const [editingExtraction, setEditingExtraction] = React.useState<Extraction | undefined>(undefined);
  const [isEditOpen, setIsEditOpen] = React.useState(false);

  const { data: response, isLoading } = useExtractionsList(params);
  const { mutate: deleteMutate, isPending: isDeleting } = useDeleteExtraction();
  const { mutate: updateMutate, isPending: isUpdating } = useUpdateExtraction(editingExtraction?.id || 0);

  const columns = React.useMemo<ColumnDef<Extraction, any>[]>(() => [
    {
      accessorKey: "made_at",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-3"
        >
          Fecha
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const dateStr = row.original.made_at;
        if (!dateStr) return "—";
        try {
          const date = new Date(dateStr);
          if (isNaN(date.getTime())) return dateStr;
          return date.toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          });
        } catch {
          return dateStr;
        }
      },
      meta: {
        label: "Fecha",
      },
    },
    {
      id: "geneticable.code",
      header: "Código Lote",
      cell: ({ row }) => (
        <div className="font-semibold tracking-wider text-neutral-900 dark:text-neutral-50">
          {row.original.geneticable?.code || "—"}
        </div>
      ),
      meta: {
        label: "Código Lote",
      },
    },
    {
      id: "extraction_type",
      header: "Tipo",
      cell: ({ row }) => <div>{row.original.extraction_type?.name || "—"}</div>,
      meta: {
        label: "Tipo",
      },
    },
    {
      id: "geneticable_type",
      header: "Tipo Material",
      cell: ({ row }) => {
        const isSemen = row.original.geneticable_type?.includes("SemenBatch") || row.original.geneticable_type === "semen_batch";
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
            isSemen 
              ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" 
              : "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
          }`}>
            {isSemen ? "Semen" : "Embrión"}
          </span>
        );
      },
      meta: {
        label: "Tipo Material",
      },
    },
    {
      id: "donor",
      header: "Donante",
      cell: ({ row }) => {
        const isSemen = row.original.geneticable_type?.includes("SemenBatch") || row.original.geneticable_type === "semen_batch";
        const batch = row.original.geneticable;
        if (!batch) return "—";

        if (isSemen) {
          const semenBatch = batch as SemenBatch;
          return semenBatch.livestock 
            ? `${semenBatch.livestock.brand_number} ${semenBatch.livestock.name ? `- ${semenBatch.livestock.name}` : ""}` 
            : "—";
        } else {
          const embrionBatch = batch as EmbrionBatch;
          return embrionBatch.mother 
            ? `${embrionBatch.mother.brand_number} ${embrionBatch.mother.name ? `- ${embrionBatch.mother.name}` : ""}` 
            : "—";
        }
      },
      meta: {
        label: "Donante",
      },
    },
    {
      id: "sire",
      header: "Padre (Sire)",
      cell: ({ row }) => {
        const isSemen = row.original.geneticable_type?.includes("SemenBatch") || row.original.geneticable_type === "semen_batch";
        const batch = row.original.geneticable;
        if (isSemen || !batch) return "—";

        const embrionBatch = batch as EmbrionBatch;
        return embrionBatch.father 
          ? `${embrionBatch.father.brand_number} ${embrionBatch.father.name ? `- ${embrionBatch.father.name}` : ""}` 
          : "—";
      },
      meta: {
        label: "Padre (Sire)",
      },
    },
    {
      accessorKey: "quantity",
      header: "Cantidad",
      cell: ({ row }) => (
        <div className="font-medium text-neutral-800 dark:text-neutral-200">
          {row.original.quantity} {row.original.quantity === 1 ? "unidad" : "unidades"}
        </div>
      ),
      meta: {
        label: "Cantidad",
      },
    },
    {
      id: "acciones",
      enableHiding: false,
      cell: ({ row }) => {
        const extraction = row.original;

        return (
          <TableActions
            actions={[
              {
                label: "Editar Extracción",
                icon: Edit,
                onClick: () => {
                  setEditingExtraction(extraction);
                  setIsEditOpen(true);
                },
              },
              {
                label: "Eliminar Registro",
                icon: Trash2,
                variant: "destructive",
                showSeparatorBefore: true,
                onClick: () => setConfirmDeleteId(extraction.id),
              },
            ]}
          />
        );
      },
    },
  ], [setEditingExtraction, setIsEditOpen, setConfirmDeleteId]);

  const extractionsData = response?.data || [];

  return (
    <>
      <DataTable
        columns={columns}
        data={extractionsData}
        pageCount={response?.meta?.last_page || 1}
        isLoading={isLoading}
        searchColumnKey="geneticable.code"
        searchPlaceholder="Buscar por código de lote..."
        tableId="extractions-table-preferences"
        defaultSort="-created_at"
        defaultIncludes={["geneticable", "technician", "extractionType"]}
        onStateChange={setParams}
      />

      {/* Modal de Edición */}
      {isEditOpen && editingExtraction && (
        <ExtractionFormModal
          open={isEditOpen}
          onOpenChange={(open) => {
            setIsEditOpen(open);
            if (!open) setEditingExtraction(undefined);
          }}
          initialData={editingExtraction}
          onSubmit={(data) => {
            updateMutate(data, {
              onSuccess: () => {
                setIsEditOpen(false);
                setEditingExtraction(undefined);
              },
            });
          }}
          isPending={isUpdating}
        />
      )}

      {/* Modal de Confirmación de Eliminación */}
      <ExtractionDeleteDialog
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
