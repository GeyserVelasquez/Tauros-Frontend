"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit, MoreHorizontal, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DataTable, SpatieQueryParams } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
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

import { Revision } from "../types";
import { useRevisionsList, useRevisionTypes, useTechniciansList } from "../hooks/useRevisions";
import { useDeleteRevision } from "../hooks/useMutateRevisions";
import { RevisionFormModal } from "./revision-form-modal";

export function RevisionTable() {
  const [params, setParams] = React.useState<SpatieQueryParams>({});
  
  // Queries
  const { data: paginatedData, isLoading, error } = useRevisionsList(params);
  const { mutate: deleteRevision, isPending: isDeleting } = useDeleteRevision();

  const { data: revisionTypes = [] } = useRevisionTypes();
  const { data: technicians = [] } = useTechniciansList();

  // Modals state
  const [confirmDeleteId, setConfirmDeleteId] = React.useState<number | null>(null);
  const [editingRevision, setEditingRevision] = React.useState<Revision | undefined>(undefined);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

  // Filters setup
  const filterFields = React.useMemo(() => [
    {
      id: "revision_type_id",
      placeholder: "Todos los tipos",
      options: revisionTypes.map((t) => ({ id: t.id, name: t.name })),
    },
    {
      id: "revision_result",
      placeholder: "Todos los resultados",
      options: [
        { id: "pregnant", name: "Preñada" },
        { id: "empty", name: "Vacía" },
        { id: "waiting", name: "En Espera" },
      ],
    },
    {
      id: "technician_id",
      placeholder: "Todos los técnicos",
      options: technicians.map((t) => ({ id: t.id, name: t.name })),
    },
  ], [revisionTypes, technicians]);

  const columns: ColumnDef<Revision, any>[] = [
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
      header: "Hembra (Vaca/Novilla)",
      cell: ({ row }) => {
        const animal = row.original.livestock;
        return (
          <div className="font-semibold tracking-wider">
            {animal ? (`${animal.brand_number} ${animal.name ? `- ${animal.name}` : ""}`) : "—"}
          </div>
        );
      },
      meta: {
        label: "Hembra",
      },
    },
    {
      id: "revision_type",
      header: "Tipo de Revisión",
      cell: ({ row }) => <div>{row.original.revision_type?.name || "—"}</div>,
      meta: {
        label: "Tipo",
      },
    },
    {
      accessorKey: "revision_result",
      header: "Resultado",
      cell: ({ row }) => {
        const result = row.getValue("revision_result") as string;
        
        let label = "Desconocido";
        let variant: "default" | "secondary" | "destructive" | "outline" = "outline";
        let className = "";

        if (result === "pregnant") {
          label = "Preñada";
          className = "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-850 hover:bg-emerald-100 dark:hover:bg-emerald-950";
        } else if (result === "empty") {
          label = "Vacía";
          className = "bg-red-100 text-red-800 border-red-300 dark:bg-red-950 dark:text-red-300 dark:border-red-850 hover:bg-red-100 dark:hover:bg-red-950";
        } else if (result === "waiting") {
          label = "En Espera";
          className = "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-850 hover:bg-amber-100 dark:hover:bg-amber-950";
        }

        return (
          <Badge variant={variant} className={`font-semibold tracking-wide py-0.5 px-2.5 ${className}`}>
            {label}
          </Badge>
        );
      },
      meta: {
        label: "Resultado",
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
        const revision = row.original;

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
                  setEditingRevision(revision);
                  setIsEditModalOpen(true);
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Editar Registro
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => setConfirmDeleteId(revision.id)}
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
        Error al cargar el historial de palpaciones. Por favor, intente nuevamente.
      </div>
    );
  }

  const revisionsData = paginatedData?.data || [];

  return (
    <>
      <DataTable
        columns={columns}
        data={revisionsData}
        pageCount={paginatedData?.meta?.last_page || 1}
        isLoading={isLoading}
        searchColumnKey="livestock.brand_number"
        searchPlaceholder="Buscar por madre..."
        tableId="revisions-table-preferences"
        defaultSort="-created_at"
        defaultIncludes={["livestock", "revisionType", "technician"]}
        filterFields={filterFields}
        onStateChange={setParams}
      />

      {/* Modal de Edición */}
      {isEditModalOpen && (
        <RevisionFormModal
          open={isEditModalOpen}
          onOpenChange={(open) => {
            setIsEditModalOpen(open);
            if (!open) setEditingRevision(undefined);
          }}
          initialData={editingRevision}
        />
      )}

      {/* Modal de Eliminación */}
      <Dialog
        open={confirmDeleteId !== null}
        onOpenChange={(open) => !open && setConfirmDeleteId(null)}
      >
        <DialogContent className="font-montserrat">
          <DialogHeader>
            <DialogTitle>¿Está seguro de eliminar este registro de palpación?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. Se removerá la información asociada a esta palpación/revisión.
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
                  deleteRevision(confirmDeleteId, {
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
