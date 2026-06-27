"use client";

import * as React from "react";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { Livestock } from "../types";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

export function LivestockTable() {
  const { data: paginatedData, isLoading, error } = useLivestockList({
    include: "breed,color,state,entryCause",
  });
  const { mutate: deleteAnimal, isPending: isDeleting } = useDeleteLivestock();

  const [confirmDeleteId, setConfirmDeleteId] = React.useState<number | null>(null);

  const columns: ColumnDef<Livestock>[] = [
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
    },
    {
      accessorKey: "name",
      header: "Nombre",
      cell: ({ row }) => <div>{row.getValue("name") || "—"}</div>,
    },
    {
      accessorKey: "animal_category",
      header: "Categoría",
      cell: ({ row }) => {
        const category = row.getValue("animal_category") as string;
        const labels: Record<string, string> = {
          bull: "Toro",
          steer: "Novillo",
          male_yearling: "Torete",
          bull_calf: "Becerro (M)",
          cow: "Vaca",
          heifer: "Novilla",
          female_yearling: "Vaquitona",
          heifer_calf: "Becerro (F)",
        };
        return <span className="text-sm font-medium">{labels[category] || category}</span>;
      },
    },
    {
      id: "breed",
      header: "Raza",
      cell: ({ row }) => <div>{row.original.breed?.name || "—"}</div>,
    },
    {
      id: "state",
      header: "Estado",
      cell: ({ row }) => <div>{row.original.state?.name || "—"}</div>,
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
    },
    {
      id: "acciones",
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
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-10 w-[250px]" />
        <Skeleton className="h-[300px] w-full rounded-md" />
      </div>
    );
  }

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
        filterColumnKey="brand_number"
        filterPlaceholder="Buscar por arete / marca..."
        tableId="livestock-table-preferences"
      />

      {/* Modal de Confirmación de Eliminación */}
      <Dialog open={confirmDeleteId !== null} onOpenChange={(open) => !open && setConfirmDeleteId(null)}>
        <DialogContent className="font-montserrat">
          <DialogHeader>
            <DialogTitle>¿Está seguro de eliminar este registro?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. Se removerá la información asociada a este animal de la base de datos.
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
                  deleteAnimal(confirmDeleteId, {
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
