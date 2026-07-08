"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DataTable, SpatieQueryParams } from "@/components/data-table";
import { TableActions } from "@/components/ui/table-actions";

import { Milking } from "../types";
import { useMilkingsList, useMilkingTypes } from "../hooks/useMilkings";
import { useTechnicians } from "@/features/technicians";
import { useDeleteMilking } from "../hooks/useMutateMilkings";
import { MilkingFormModal } from "./milking-form-modal";
import { MilkingDeleteDialog } from "./milking-delete-dialog";

export function MilkingTable() {
  const [params, setParams] = React.useState<SpatieQueryParams>({});

  // Queries
  const { data: paginatedData, isLoading, error } = useMilkingsList(params);
  const { mutate: deleteMilking, isPending: isDeleting } = useDeleteMilking();

  const { data: milkingTypes = [] } = useMilkingTypes();
  const { data: technicians = [] } = useTechnicians();

  // Modals state
  const [confirmDeleteId, setConfirmDeleteId] = React.useState<number | null>(null);
  const [editingMilking, setEditingMilking] = React.useState<Milking | undefined>(undefined);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

  // Filters setup
  const filterFields = React.useMemo(() => [
    {
      id: "milking_type_id",
      placeholder: "Todos los tipos",
      options: milkingTypes.map((t) => ({ id: t.id, name: t.name })),
    },
    {
      id: "technician_id",
      placeholder: "Todos los técnicos",
      options: technicians.map((t) => ({ id: t.id, name: t.name })),
    },
  ], [milkingTypes, technicians]);

  const columns: ColumnDef<Milking, any>[] = React.useMemo(() => [
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
      header: "Vaca / Novilla",
      cell: ({ row }) => {
        const animal = row.original.livestock;
        return (
          <div className="font-semibold tracking-wider">
            {animal ? `${animal.brand_number} ${animal.name ? `- ${animal.name}` : ""}` : "—"}
          </div>
        );
      },
      meta: {
        label: "Vaca/Novilla",
      },
    },
    {
      id: "milking_type",
      header: "Tipo de Ordeño",
      cell: ({ row }) => <div>{row.original.milking_type?.name || "—"}</div>,
      meta: {
        label: "Tipo",
      },
    },
    {
      accessorKey: "first_weight",
      header: "Ordeño 1 (Kg)",
      cell: ({ row }) => <div>{Number(row.getValue("first_weight")).toFixed(2)}</div>,
      meta: {
        label: "Ordeño 1",
      },
    },
    {
      accessorKey: "second_weight",
      header: "Ordeño 2 (Kg)",
      cell: ({ row }) => <div>{Number(row.getValue("second_weight")).toFixed(2)}</div>,
      meta: {
        label: "Ordeño 2",
      },
    },
    {
      accessorKey: "third_weight",
      header: "Ordeño 3 (Kg)",
      cell: ({ row }) => <div>{Number(row.getValue("third_weight")).toFixed(2)}</div>,
      meta: {
        label: "Ordeño 3",
      },
    },
    {
      id: "total_milk",
      header: "Total (Kg)",
      cell: ({ row }) => {
        const first = Number(row.original.first_weight || 0);
        const second = Number(row.original.second_weight || 0);
        const third = Number(row.original.third_weight || 0);
        return <div className="font-bold">{(first + second + third).toFixed(2)}</div>;
      },
      meta: {
        label: "Total Leche",
      },
    },
    {
      id: "technician",
      header: "Técnico / Operario",
      cell: ({ row }) => <div>{row.original.technician?.name || "—"}</div>,
      meta: {
        label: "Técnico",
      },
    },
    {
      id: "acciones",
      enableHiding: false,
      cell: ({ row }) => {
        const milking = row.original;

        return (
          <TableActions
            actions={[
              {
                label: "Editar Registro",
                icon: Edit,
                onClick: () => {
                  setEditingMilking(milking);
                  setIsEditModalOpen(true);
                },
              },
              {
                label: "Eliminar Registro",
                icon: Trash2,
                variant: "destructive",
                showSeparatorBefore: true,
                onClick: () => setConfirmDeleteId(milking.id),
              },
            ]}
          />
        );
      },
    },
  ], [setEditingMilking, setIsEditModalOpen, setConfirmDeleteId]);

  if (error) {
    return (
      <div className="p-8 text-center font-montserrat text-red-500">
        Error al cargar el registro de ordeños. Por favor, intente nuevamente.
      </div>
    );
  }

  const milkingsData = paginatedData?.data || [];

  return (
    <>
      <DataTable
        columns={columns}
        data={milkingsData}
        pageCount={paginatedData?.meta?.last_page || 1}
        isLoading={isLoading}
        searchColumnKey="livestock.brand_number"
        searchPlaceholder="Buscar por marca..."
        tableId="milkings-table-preferences"
        defaultSort="-created_at"
        defaultIncludes={["livestock", "milkingType", "technician"]}
        filterFields={filterFields}
        onStateChange={setParams}
      />

      {/* Modal de Edición */}
      {isEditModalOpen && (
        <MilkingFormModal
          open={isEditModalOpen}
          onOpenChange={(open) => {
            setIsEditModalOpen(open);
            if (!open) setEditingMilking(undefined);
          }}
          initialData={editingMilking}
        />
      )}

      {/* Modal de Confirmación de Eliminación */}
      <MilkingDeleteDialog
        isOpen={confirmDeleteId !== null}
        onOpenChange={(open) => !open && setConfirmDeleteId(null)}
        isDeleting={isDeleting}
        onConfirm={() => {
          if (confirmDeleteId) {
            deleteMilking(confirmDeleteId, {
              onSuccess: () => setConfirmDeleteId(null),
            });
          }
        }}
      />
    </>
  );
}
