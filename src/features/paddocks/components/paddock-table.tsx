"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DataTable, SpatieQueryParams } from "@/components/data-table";
import { Paddock } from "../types";
import { usePaddockList } from "../hooks/usePaddocks";
import { useDeletePaddock } from "../hooks/useMutatePaddocks";
import { ArrowUpDown, Edit, Trash2 } from "lucide-react";
import { PaddockFormDialog } from "./paddock-form-dialog";
import { PaddockDeleteDialog } from "./paddock-delete-dialog";

interface PaddockTableProps {
  onCreateTrigger?: boolean;
  onCreateTriggerChange?: (val: boolean) => void;
}

export function PaddockTable({ onCreateTrigger, onCreateTriggerChange }: PaddockTableProps) {
  const [params, setParams] = React.useState<SpatieQueryParams>({});
  const { data: paginatedData, isLoading, error } = usePaddockList(params);
  const { mutate: deletePaddock, isPending: isDeleting } = useDeletePaddock();

  const [confirmDeleteId, setConfirmDeleteId] = React.useState<number | null>(null);
  const [editingPaddock, setEditingPaddock] = React.useState<Paddock | null>(null);
  const [isFormOpen, setIsFormOpen] = React.useState(false);

  React.useEffect(() => {
    if (onCreateTrigger) {
      setIsFormOpen(true);
      if (onCreateTriggerChange) onCreateTriggerChange(false);
    }
  }, [onCreateTrigger, onCreateTriggerChange]);

  const handleEdit = (paddock: Paddock) => {
    setEditingPaddock(paddock);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setConfirmDeleteId(id);
  };

  const handleConfirmDelete = () => {
    if (confirmDeleteId !== null) {
      deletePaddock(confirmDeleteId, {
        onSuccess: () => {
          setConfirmDeleteId(null);
        },
      });
    }
  };

  const columns: ColumnDef<Paddock, any>[] = React.useMemo(() => [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-3 font-semibold"
        >
          Nombre
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="font-semibold text-foreground">{row.getValue("name")}</div>,
      meta: { label: "Nombre" },
    },
    {
      accessorKey: "code",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-3 font-semibold"
        >
          Código
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="font-mono text-sm text-muted-foreground">{row.getValue("code") || "—"}</div>,
      meta: { label: "Código" },
    },
    {
      accessorKey: "area",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-3 font-semibold"
        >
          Área
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const area = row.getValue("area");
        return <div className="text-muted-foreground">{area ? `${area} ha` : "—"}</div>;
      },
      meta: { label: "Área" },
    },
    {
      id: "actions",
      header: () => <span className="font-semibold text-right block pr-4 text-muted-foreground">Acciones</span>,
      cell: ({ row }) => {
        const paddock = row.original;
        return (
          <div className="flex justify-end gap-2 pr-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEdit(paddock)}
              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDeleteClick(paddock.id)}
              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ], []);

  const paddockData = paginatedData?.data || [];

  return (
    <>
      <DataTable
        columns={columns}
        data={paddockData}
        pageCount={paginatedData?.meta?.last_page || 1}
        isLoading={isLoading}
        searchColumnKey="name"
        searchPlaceholder="Buscar por nombre o código..."
        tableId="paddocks-table-preferences"
        onStateChange={setParams}
      />

      <PaddockFormDialog
        isOpen={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) setEditingPaddock(null);
        }}
        paddock={editingPaddock}
      />

      <PaddockDeleteDialog
        isOpen={confirmDeleteId !== null}
        onOpenChange={(open) => {
          if (!open) setConfirmDeleteId(null);
        }}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </>
  );
}
