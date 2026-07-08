"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DataTable, SpatieQueryParams } from "@/components/data-table";
import { TableActions } from "@/components/ui/table-actions";

import { Growth } from "../types";
import { useGrowthsList, useGrowthTypes } from "../hooks/useGrowths";
import { useTechnicians } from "@/features/technicians";
import { useDeleteGrowth } from "../hooks/useMutateGrowths";
import { GrowthFormModal } from "./growth-form-modal";
import { GrowthDeleteDialog } from "./growth-delete-dialog";

export function GrowthTable() {
  const [params, setParams] = React.useState<SpatieQueryParams>({});

  // Queries
  const { data: paginatedData, isLoading, error } = useGrowthsList(params);
  const { mutate: deleteGrowth, isPending: isDeleting } = useDeleteGrowth();

  const { data: growthTypes = [] } = useGrowthTypes();
  const { data: technicians = [] } = useTechnicians();

  // Modals state
  const [confirmDeleteId, setConfirmDeleteId] = React.useState<number | null>(null);
  const [editingGrowth, setEditingGrowth] = React.useState<Growth | undefined>(undefined);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

  // Filters setup
  const filterFields = React.useMemo(() => [
    {
      id: "growth_type_id",
      placeholder: "Todos los tipos",
      options: growthTypes.map((t) => ({ id: t.id, name: t.name })),
    },
    {
      id: "technician_id",
      placeholder: "Todos los técnicos",
      options: technicians.map((t) => ({ id: t.id, name: t.name })),
    },
  ], [growthTypes, technicians]);

  const columns: ColumnDef<Growth, any>[] = React.useMemo(() => [
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
        const rawDate = row.getValue("made_at") as string;
        const formattedDate = rawDate ? rawDate.split("T")[0] : "—";
        return <div className="font-medium">{formattedDate}</div>;
      },
      meta: {
        label: "Fecha",
      },
    },
    {
      id: "livestock.brand_number",
      header: "Animal",
      cell: ({ row }) => {
        const animal = row.original.livestock;
        return (
          <div className="font-semibold tracking-wider">
            {animal ? `${animal.brand_number} ${animal.name ? `- ${animal.name}` : ""}` : "—"}
          </div>
        );
      },
      meta: {
        label: "Animal",
      },
    },
    {
      id: "growth_type",
      header: "Tipo de Registro",
      cell: ({ row }) => <div>{row.original.growth_type?.name || "—"}</div>,
      meta: {
        label: "Tipo de Registro",
      },
    },
    {
      accessorKey: "weight",
      header: "Peso (Kg)",
      cell: ({ row }) => <div className="font-semibold">{Number(row.getValue("weight")).toFixed(2)}</div>,
      meta: {
        label: "Peso",
      },
    },
    {
      accessorKey: "height",
      header: "Altura (Cm)",
      cell: ({ row }) => {
        const height = row.getValue("height");
        return <div>{height !== null && height !== undefined ? `${Number(height).toFixed(2)}` : "—"}</div>;
      },
      meta: {
        label: "Altura",
      },
    },
    {
      accessorKey: "length",
      header: "Largo (Cm)",
      cell: ({ row }) => {
        const length = row.original.length;
        return <div>{length !== null && length !== undefined ? `${Number(length).toFixed(2)}` : "—"}</div>;
      },
      meta: {
        label: "Largo",
      },
    },
    {
      accessorKey: "thoracic_width",
      header: "Ancho Tor. (Cm)",
      cell: ({ row }) => {
        const width = row.original.thoracic_width;
        return <div>{width !== null && width !== undefined ? `${Number(width).toFixed(2)}` : "—"}</div>;
      },
      meta: {
        label: "Ancho Torácico",
      },
    },
    {
      id: "technician",
      header: "Técnico / Registrador",
      cell: ({ row }) => <div>{row.original.technician?.name || "—"}</div>,
      meta: {
        label: "Técnico",
      },
    },
    {
      id: "acciones",
      enableHiding: false,
      cell: ({ row }) => {
        const growth = row.original;

        return (
          <TableActions
            actions={[
              {
                label: "Editar Registro",
                icon: Edit,
                onClick: () => {
                  setEditingGrowth(growth);
                  setIsEditModalOpen(true);
                },
              },
              {
                label: "Eliminar Registro",
                icon: Trash2,
                variant: "destructive",
                showSeparatorBefore: true,
                onClick: () => setConfirmDeleteId(growth.id),
              },
            ]}
          />
        );
      },
    },
  ], [setEditingGrowth, setIsEditModalOpen, setConfirmDeleteId]);

  if (error) {
    return (
      <div className="p-8 text-center font-montserrat text-red-500">
        Error al cargar el registro de crecimiento. Por favor, intente nuevamente.
      </div>
    );
  }

  const growthsData = paginatedData?.data || [];

  return (
    <>
      <DataTable
        columns={columns}
        data={growthsData}
        pageCount={paginatedData?.meta?.last_page || 1}
        isLoading={isLoading}
        searchColumnKey="livestock.brand_number"
        searchPlaceholder="Buscar por marca..."
        tableId="growths-table-preferences"
        defaultSort="-created_at"
        defaultIncludes={["livestock", "growthType", "technician"]}
        filterFields={filterFields}
        onStateChange={setParams}
      />

      {/* Modal de Edición */}
      {isEditModalOpen && (
        <GrowthFormModal
          open={isEditModalOpen}
          onOpenChange={(open) => {
            setIsEditModalOpen(open);
            if (!open) setEditingGrowth(undefined);
          }}
          initialData={editingGrowth}
        />
      )}

      {/* Modal de Confirmación de Eliminación */}
      <GrowthDeleteDialog
        isOpen={confirmDeleteId !== null}
        onOpenChange={(open) => !open && setConfirmDeleteId(null)}
        isDeleting={isDeleting}
        onConfirm={() => {
          if (confirmDeleteId) {
            deleteGrowth(confirmDeleteId, {
              onSuccess: () => setConfirmDeleteId(null),
            });
          }
        }}
      />
    </>
  );
}
