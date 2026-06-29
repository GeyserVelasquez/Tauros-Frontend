"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { toast } from "sonner";

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

import { Service, SemenBatch, EmbrionBatch } from "../types";
import { useServicesList } from "../hooks/useServices";
import { useDeleteService } from "../hooks/useMutateServices";
import { ServiceFormModal } from "./service-form-modal";
import { Livestock } from "@/features/livestock";

export function ServiceTable() {
  const [params, setParams] = React.useState<SpatieQueryParams>({});
  
  // Consulta de servicios reproductivos con TanStack Query
  const { data: paginatedData, isLoading, error } = useServicesList(params);
  const { mutate: deleteService, isPending: isDeleting } = useDeleteService();

  // Estados de control de modals
  const [confirmDeleteId, setConfirmDeleteId] = React.useState<number | null>(null);
  const [editingService, setEditingService] = React.useState<Service | undefined>(undefined);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

  const columns: ColumnDef<Service, any>[] = [
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
      cell: ({ row }) => <div className="font-medium">{row.getValue("made_at")}</div>,
      meta: {
        label: "Fecha de Servicio",
      },
    },
    {
      id: "female",
      header: "Hembra",
      cell: ({ row }) => {
        const female = row.original.female;
        return (
          <div className="font-semibold tracking-wider">
            {female ? `${female.brand_number} ${female.name ? `- ${female.name}` : ""}` : "—"}
          </div>
        );
      },
      meta: {
        label: "Hembra",
      },
    },
    {
      id: "service_type",
      header: "Tipo",
      cell: ({ row }) => <div>{row.original.service_type?.name || "—"}</div>,
      meta: {
        label: "Tipo de Servicio",
      },
    },
    {
      accessorKey: "parentable_type",
      header: "Origen",
      cell: ({ row }) => {
        const type = row.getValue("parentable_type") as string;
        const labels: Record<string, string> = {
          livestock: "Toro",
          semen_batch: "Semen",
          embrion_batch: "Embrion",
        };
        return <span className="">{labels[type] || type}</span>;
      },
      meta: {
        label: "Tipo de Parental",
      },
    },
    {
      id: "parentable",
      header: "Servidor",
      cell: ({ row }) => {
        const type = row.original.parentable_type;
        const parentable = row.original.parentable;
        if (!parentable) return <span className="text-muted-foreground">—</span>;

        if (type === "livestock") {
          const bull = parentable as Livestock;
          return <span className="font-semibold">{bull.brand_number} {bull.name ? `(${bull.name})` : ""}</span>;
        } else if (type === "semen_batch") {
          const semen = parentable as SemenBatch;
          return <span>{semen.code} ({semen.name})</span>;
        } else if (type === "embrion_batch") {
          const embryo = parentable as EmbrionBatch;
          return <span>{embryo.code} ({embryo.name})</span>;
        }
        return <span className="text-muted-foreground">—</span>;
      },
      meta: {
        label: "Parental",
      },
    },
    {
      id: "technician",
      header: "Técnico / Vet",
      cell: ({ row }) => <div>{row.original.technician?.name || "—"}</div>,
      meta: {
        label: "Técnico",
      },
    },
    {
      id: "acciones",
      enableHiding: false,
      cell: ({ row }) => {
        const service = row.original;

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
                  setEditingService(service);
                  setIsEditModalOpen(true);
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Editar Registro
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => setConfirmDeleteId(service.id)}
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
        Error al cargar los servicios reproductivos. Por favor, intente nuevamente.
      </div>
    );
  }

  const servicesData = paginatedData?.data || [];

  return (
    <>
      <DataTable
        columns={columns}
        data={servicesData}
        pageCount={paginatedData?.meta?.last_page || 1}
        isLoading={isLoading}
        tableId="services-table-preferences"
        defaultSort="-created_at"
        defaultIncludes={["female", "technician", "serviceType", "parentable"]}
        onStateChange={setParams}
      />

      {/* Modal de Edición de Servicio */}
      {isEditModalOpen && (
        <ServiceFormModal
          open={isEditModalOpen}
          onOpenChange={(open) => {
            setIsEditModalOpen(open);
            if (!open) setEditingService(undefined);
          }}
          initialData={editingService}
        />
      )}

      {/* Modal de Confirmación de Eliminación */}
      <Dialog
        open={confirmDeleteId !== null}
        onOpenChange={(open) => !open && setConfirmDeleteId(null)}
      >
        <DialogContent className="font-montserrat">
          <DialogHeader>
            <DialogTitle>¿Está seguro de eliminar este registro de servicio?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. Se removerá la información asociada a este servicio de la base de datos.
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
                  deleteService(confirmDeleteId, {
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
