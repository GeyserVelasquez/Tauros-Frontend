"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit, MoreHorizontal, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DataTable, SpatieQueryParams } from "@/components/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Abort } from "../types";
import { useAbortsList, useAbortTypes, useTechniciansList } from "../hooks/useAborts";
import { useDeleteAbort } from "../hooks/useMutateAborts";
import { AbortFormModal } from "./abort-form-modal";

export function AbortTable() {
  const [params, setParams] = React.useState<SpatieQueryParams>({});
  
  // Queries
  const { data: paginatedData, isLoading, error } = useAbortsList(params);
  const { mutate: deleteAbort, isPending: isDeleting } = useDeleteAbort();

  const { data: abortTypes = [] } = useAbortTypes();
  const { data: technicians = [] } = useTechniciansList();

  // Modals state
  const [confirmDeleteId, setConfirmDeleteId] = React.useState<number | null>(null);
  const [editingAbort, setEditingAbort] = React.useState<Abort | undefined>(undefined);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

  // Filters setup
  const filterFields = React.useMemo(() => [
    {
      id: "abort_type_id",
      placeholder: "Todos los tipos",
      options: abortTypes.map((t) => ({ id: t.id, name: t.name })),
    },
    {
      id: "technician_id",
      placeholder: "Todos los técnicos",
      options: technicians.map((t) => ({ id: t.id, name: t.name })),
    },
  ], [abortTypes, technicians]);

  const columns: ColumnDef<Abort, any>[] = [
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
      id: "female",
      header: "Hembra (Vaca/Novilla)",
      cell: ({ row }) => {
        const animal = row.original.livestock;
        return (
          <div className="font-semibold tracking-wider">
            {animal ? `${animal.brand_number} ${animal.name ? `- ${animal.name}` : ""}` : "—"}
          </div>
        );
      },
      meta: {
        label: "Hembra",
      },
    },
    {
      id: "abort_type",
      header: "Tipo de Aborto",
      cell: ({ row }) => <div>{row.original.abort_type?.name || "—"}</div>,
      meta: {
        label: "Tipo",
      },
    },
    {
      id: "technician",
      header: "Veterinario / Técnico",
      cell: ({ row }) => <div>{row.original.technician?.name || "—"}</div>,
      meta: {
        label: "Técnico",
      },
    },
    {
      id: "acciones",
      enableHiding: false,
      cell: ({ row }) => {
        const abort = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menú</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="font-montserrat">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem
                onClick={() => {
                  setEditingAbort(abort);
                  setIsEditModalOpen(true);
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Editar Registro
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => setConfirmDeleteId(abort.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar Registro
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (error) {
    return (
      <div className="p-8 text-center font-montserrat text-red-500">
        Error al cargar el registro de abortos. Por favor, intente nuevamente.
      </div>
    );
  }

  const abortsData = paginatedData?.data || [];

  return (
    <>
      <DataTable
        columns={columns}
        data={abortsData}
        pageCount={paginatedData?.meta?.last_page || 1}
        isLoading={isLoading}
        searchColumnKey="livestock.brand_number"
        searchPlaceholder="Buscar por madre..."
        tableId="aborts-table-preferences"
        defaultSort="-created_at"
        defaultIncludes={["livestock", "abortType", "technician"]}
        filterFields={filterFields}
        onStateChange={setParams}
      />

      {/* Modal de Edición */}
      {isEditModalOpen && (
        <AbortFormModal
          open={isEditModalOpen}
          onOpenChange={(open) => {
            setIsEditModalOpen(open);
            if (!open) setEditingAbort(undefined);
          }}
          initialData={editingAbort}
        />
      )}

      {/* Modal de Eliminación */}
      <Dialog
        open={confirmDeleteId !== null}
        onOpenChange={(open) => !open && setConfirmDeleteId(null)}
      >
        <DialogContent className="font-montserrat">
          <DialogHeader>
            <DialogTitle>¿Está seguro de eliminar este registro de aborto?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. Se removerá la información asociada a este aborto.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDeleteId(null)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              disabled={isDeleting}
              onClick={() => {
                if (confirmDeleteId) {
                  deleteAbort(confirmDeleteId, {
                    onSuccess: () => setConfirmDeleteId(null),
                  });
                }
              }}
            >
              {isDeleting ? "Eliminando..." : "Eliminar Registro"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
