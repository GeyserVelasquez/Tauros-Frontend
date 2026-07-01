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

import { Service, SemenBatch, EmbrionBatch } from "../types";
import { useServicesList, useServiceTypes } from "../hooks/useServices";
import { useTechnicians } from "@/features/technicians";
import { useDeleteService } from "../hooks/useMutateServices";
import { ServiceFormModal } from "./service-form-modal";
import { ServiceDeleteDialog } from "./service-delete-dialog";
import { Livestock } from "@/features/livestock";

const PARENTABLE_TYPE_LABELS: Record<string, string> = {
  livestock: "Toro",
  semen_batch: "Semen",
  embrion_batch: "Embrión",
};

export function ServiceTable() {
  const [params, setParams] = React.useState<SpatieQueryParams>({});
  
  // Consulta de servicios reproductivos con TanStack Query
  const { data: paginatedData, isLoading, error } = useServicesList(params);
  const { mutate: deleteService, isPending: isDeleting } = useDeleteService();

  // Consultas para los catálogos de filtros
  const { data: serviceTypes = [] } = useServiceTypes();
  const { data: technicians = [] } = useTechnicians();

  // Definición de campos de filtrado para el DataTable
  const filterFields = React.useMemo(() => [
    {
      id: "service_type_id",
      placeholder: "Todos los servicios",
      options: serviceTypes.map((t) => ({ id: t.id, name: t.name })),
    },
    {
      id: "parentable_type",
      placeholder: "Todos los servidores",
      options: [
        { id: "livestock", name: "Toros" },
        { id: "semen_batch", name: "Inseminaciones" },
        { id: "embrion_batch", name: "Embriones" },
      ],
    },
    {
      id: "technician_id",
      placeholder: "Todos los técnicos",
      options: technicians.map((t) => ({ id: t.id, name: t.name })),
    },
  ], [serviceTypes, technicians]);

  // Estados de control de modals
  const [confirmDeleteId, setConfirmDeleteId] = React.useState<number | null>(null);
  const [editingService, setEditingService] = React.useState<Service | undefined>(undefined);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

  const columns: ColumnDef<Service, any>[] = React.useMemo(() => [
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
        label: "Fecha",
      },
    },
    {
      id: "female.brand_number",
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
        label: "Tipo",
      },
    },
    {
      accessorKey: "parentable_type",
      header: "Origen",
      cell: ({ row }) => {
        const type = row.getValue("parentable_type") as string;
        return <span>{PARENTABLE_TYPE_LABELS[type] || type}</span>;
      },
      meta: {
        label: "Origen",
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
          return <span className="font-semibold">{bull.brand_number} {bull.name ? `- ${bull.name}` : ""}</span>;
        } else if (type === "semen_batch") {
          const semen = parentable as SemenBatch;
          return <span className="font-semibold">{semen.code} {semen.name ? `- ${semen.name}` : ""}</span>;
        } else if (type === "embrion_batch") {
          const embryo = parentable as EmbrionBatch;
          return <span className="font-semibold">{embryo.code} {embryo.name ? `- ${embryo.name}` : ""}</span>;
        }
        return <span className="text-muted-foreground">—</span>;
      },
      meta: {
        label: "Servidor",
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
  ], [setEditingService, setIsEditModalOpen, setConfirmDeleteId]);

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
        searchColumnKey="female.brand_number"
        searchPlaceholder="Buscar por madre..."
        tableId="services-table-preferences"
        defaultSort="-created_at"
        defaultIncludes={["female", "technician", "serviceType", "parentable"]}
        filterFields={filterFields}
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

      {/* Modal de Confirmación de Eliminación Modularizado */}
      <ServiceDeleteDialog
        isOpen={confirmDeleteId !== null}
        onOpenChange={(open) => !open && setConfirmDeleteId(null)}
        isDeleting={isDeleting}
        onConfirm={() => {
          if (confirmDeleteId) {
            deleteService(confirmDeleteId, {
              onSuccess: () => setConfirmDeleteId(null),
            });
          }
        }}
      />
    </>
  );
}
