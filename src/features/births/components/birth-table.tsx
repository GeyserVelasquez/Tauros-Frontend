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

import { Birth } from "../types";
import { useBirthsList } from "../hooks/useBirths";
import { useDeleteBirth, useUpdateBirth } from "../hooks/useMutateBirths";
import { BirthWizardForm } from "./birth-wizard-form";

export function BirthTable() {
  const [params, setParams] = React.useState<SpatieQueryParams>({});
  const [confirmDeleteId, setConfirmDeleteId] = React.useState<number | null>(null);

  // States for modal editing on same page
  const [editingBirth, setEditingBirth] = React.useState<Birth | undefined>(undefined);
  const [isEditOpen, setIsEditOpen] = React.useState(false);

  const { data: response, isLoading } = useBirthsList(params);
  const { mutate: deleteMutate, isPending: isDeleting } = useDeleteBirth();
  const { mutate: updateMutate, isPending: isUpdating } = useUpdateBirth(editingBirth?.id || 0);

  const columns = React.useMemo<ColumnDef<Birth, any>[]>(() => [
    {
      accessorKey: "birth_date",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-3"
        >
          Fecha Parto
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const dateStr = row.original.birth_date;
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
        label: "Fecha Parto",
      },
    },
    {
      accessorKey: "postbirth_revision_date",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-3"
        >
          Fecha Revisión
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const dateStr = row.original.postbirth_revision_date;
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
        label: "Fecha Revisión",
      },
    },
    {
      id: "mother.brand_number",
      header: "Madre",
      cell: ({ row }) => {
        const mother = row.original.mother;
        return (
          <div className="font-semibold tracking-wider">
            {mother ? `${mother.brand_number} ${mother.name ? `- ${mother.name}` : ""}` : "—"}
          </div>
        );
      },
      meta: {
        label: "Madre",
      },
    },
    {
      id: "birth_type",
      header: "Tipo de Parto",
      cell: ({ row }) => <div>{row.original.birth_type?.name || "—"}</div>,
      meta: {
        label: "Tipo de Parto",
      },
    },
    {
      id: "newborns_count",
      header: "Crías",
      cell: ({ row }) => {
        const count = row.original.newborns?.length || 0;
        return (
          <div className="font-medium">
            {count} {count === 1 ? "cría" : "crías"}
          </div>
        );
      },
      meta: {
        label: "Crías",
      },
    },
    {
      id: "acciones",
      enableHiding: false,
      cell: ({ row }) => {
        const birth = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menú</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem
                onClick={() => {
                  setEditingBirth(birth);
                  setIsEditOpen(true);
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Editar Registro
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => setConfirmDeleteId(birth.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar Registro
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ], []);

  const birthsData = response?.data || [];

  return (
    <>
      <DataTable
        columns={columns}
        data={birthsData}
        pageCount={response?.meta?.last_page || 1}
        isLoading={isLoading}
        searchColumnKey="mother.brand_number"
        searchPlaceholder="Buscar por arete de la madre..."
        tableId="births-table-preferences"
        defaultSort="-created_at"
        defaultIncludes={["mother", "birthType", "newborns"]}
        onStateChange={setParams}
      />

      {/* Modal de Edición */}
      {isEditOpen && editingBirth && (
        <BirthWizardForm
          open={isEditOpen}
          onOpenChange={(open) => {
            setIsEditOpen(open);
            if (!open) setEditingBirth(undefined);
          }}
          initialData={editingBirth}
          onSubmit={(data) => {
            updateMutate(data, {
              onSuccess: () => {
                setIsEditOpen(false);
                setEditingBirth(undefined);
              },
            });
          }}
          isPending={isUpdating}
        />
      )}

      {/* Modal de Confirmación de Eliminación */}
      <Dialog open={confirmDeleteId !== null} onOpenChange={(open: boolean) => !open && setConfirmDeleteId(null)}>
        <DialogContent className="font-montserrat">
          <DialogHeader>
            <DialogTitle>¿Está seguro de eliminar este registro?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. Se removerá la información asociada a este parto de la base de datos.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteId(null)} disabled={isDeleting}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              disabled={isDeleting}
              onClick={() => {
                if (confirmDeleteId) {
                  deleteMutate(confirmDeleteId, {
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
