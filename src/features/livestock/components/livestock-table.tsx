"use client";

import * as React from "react";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, SpatieQueryParams } from "@/components/data-table";
import { ANIMAL_CATEGORY_LABELS, AnimalCategory, Livestock } from "../types";
import { useLivestockList } from "../hooks/useLivestock";
import { useDeleteLivestock } from "../hooks/useMutateLivestock";
import { ArrowUpDown, Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LivestockDeleteDialog } from "./livestock-delete-dialog";
import { useBreeds } from "@/features/breeds";
import { useColors } from "@/features/colors";
import { useEntryCauses } from "@/features/entry-causes";
import { useStates } from "@/features/states";

export function LivestockTable() {
  const [params, setParams] = React.useState<SpatieQueryParams>({});

  // Carga de opciones de catálogos para los selectores de filtros
  const { data: breeds = [] } = useBreeds();
  const { data: colors = [] } = useColors();
  const { data: states = [] } = useStates();
  const { data: entryCauses = [] } = useEntryCauses();

  const filterFields = React.useMemo(() => [
    { id: "breed_id", placeholder: "Todas las razas", options: breeds },
    { id: "color_id", placeholder: "Todos los colores", options: colors },
    { id: "state_id", placeholder: "Todos los estados", options: states },
    { id: "entry_cause_id", placeholder: "Todas las causas", options: entryCauses },
  ], [breeds, colors, states, entryCauses]);
  
  // Consulta de ganado al backend enviando los parámetros mapeados por DataTable
  const { data: paginatedData, isLoading, error } = useLivestockList(params);
  const { mutate: deleteAnimal, isPending: isDeleting } = useDeleteLivestock();

  const [confirmDeleteId, setConfirmDeleteId] = React.useState<number | null>(null);

  const columns: ColumnDef<Livestock, any>[] = React.useMemo(() => [
    {
      id: "seleccion",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Seleccionar todo"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Seleccionar fila"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "brand_number",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-3"
        >
          Marca / Arete
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-semibold tracking-wider">{row.getValue("brand_number")}</div>
      ),
      meta: {
        label: "Marca / Arete",
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
          Nombre
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("name") || "—"}</div>,
      meta: {
        label: "Nombre del Animal",
      },
    },
    {
      accessorKey: "animal_category",
      header: "Categoría",
      cell: ({ row }) => {
        const category = row.getValue("animal_category") as AnimalCategory;
        return <span className="text-sm font-medium">{ANIMAL_CATEGORY_LABELS[category] || category}</span>;
      },
      meta: {
        label: "Categoría",
      },
    },
    {
      id: "breed",
      header: "Raza",
      cell: ({ row }) => <div>{row.original.breed?.name || "—"}</div>,
      meta: {
        label: "Raza",
      },
    },
    {
      id: "state",
      header: "Estado",
      cell: ({ row }) => <div>{row.original.state?.name || "—"}</div>,
      meta: {
        label: "Estado de Salud",
      },
    },
    {
      accessorKey: "is_alive",
      header: "Vida",
      cell: ({ row }) => {
        const isAlive = row.getValue("is_alive") as boolean;
        return (
          <Badge variant={isAlive ? "default" : "destructive"}>
            {isAlive ? "Vivo" : "Muerto"}
          </Badge>
        );
      },
      meta: {
        label: "Estado Vital",
      },
    },
    {
      accessorKey: "is_enabled",
      header: "Disponibilidad",
      cell: ({ row }) => {
        const isEnabled = row.getValue("is_enabled") as boolean;
        return (
          <Badge variant={isEnabled ? "outline" : "secondary"}>
            {isEnabled ? "Activo" : "Inactivo"}
          </Badge>
        );
      },
      meta: {
        label: "Disponibilidad",
      },
    },
    {
      id: "acciones",
      enableHiding: false,
      cell: ({ row }) => {
        const animal = row.original;

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
              
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/livestock/${animal.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  Ver Detalles
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link href={`/dashboard/livestock/${animal.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar Registro
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => setConfirmDeleteId(animal.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar Animal
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ], [setConfirmDeleteId]);

  if (error) {
    return (
      <div className="p-8 text-center font-montserrat text-red-500">
        Error al cargar el inventario de ganado. Por favor, intente nuevamente.
      </div>
    );
  }

  const livestockData = paginatedData?.data || [];

  return (
    <>
      <DataTable
        columns={columns}
        data={livestockData}
        pageCount={paginatedData?.meta?.last_page || 1}
        isLoading={isLoading}
        searchColumnKey="brand_number"
        searchPlaceholder="Buscar por hierro"
        tableId="livestock-table-preferences"
        defaultSort="-created_at"
        defaultIncludes={["breed", "color", "state", "entryCause"]}
        filterFields={filterFields}
        onStateChange={setParams}
      />

      {/* Modal de Confirmación de Eliminación Modularizado */}
      <LivestockDeleteDialog
        isOpen={confirmDeleteId !== null}
        onOpenChange={(open) => !open && setConfirmDeleteId(null)}
        isDeleting={isDeleting}
        onConfirm={() => {
          if (confirmDeleteId) {
            deleteAnimal(confirmDeleteId, {
              onSuccess: () => setConfirmDeleteId(null),
            });
          }
        }}
      />
    </>
  );
}
