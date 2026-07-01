"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DataTable, SpatieQueryParams } from "@/components/data-table";
import { TableActions } from "@/components/ui/table-actions";

import { Service, SemenBatch, EmbrionBatch } from "../types";
import { useServicesList, useServiceTypes } from "../hooks/useServices";
import { useTechnicians } from "@/features/technicians";
import { useDeleteService } from "../hooks/useMutateServices";
import { ServiceFormModal } from "./service-form-modal";
import { ServiceDeleteDialog } from "./service-delete-dialog";
import { Livestock } from "@/features/livestock";
import { PARENTABLE_TYPE_LABELS, PARENTABLE_TYPE_OPTIONS, ParentableType } from "@/features/genetics";

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
      options: PARENTABLE_TYPE_OPTIONS,
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
        const type = row.getValue("parentable_type") as ParentableType;
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

        const codeExtractors: Record<ParentableType, (p: any) => string> = {
          livestock: (p: Livestock) => p.brand_number,
          semen_batch: (p: SemenBatch) => p.code,
          embrion_batch: (p: EmbrionBatch) => p.code,
        };

        const code = codeExtractors[type]?.(parentable);
        if (!code) return <span className="text-muted-foreground">—</span>;

        const name = (parentable as any).name;
        return (
          <span className="font-semibold">
            {code} {name ? `- ${name}` : ""}
          </span>
        );
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
          <TableActions
            actions={[
              {
                label: "Editar Registro",
                icon: Edit,
                onClick: () => {
                  setEditingService(service);
                  setIsEditModalOpen(true);
                },
              },
              {
                label: "Eliminar Registro",
                icon: Trash2,
                variant: "destructive",
                showSeparatorBefore: true,
                onClick: () => setConfirmDeleteId(service.id),
              },
            ]}
          />
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
