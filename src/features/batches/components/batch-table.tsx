"use client";

import * as React from "react";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, SpatieQueryParams } from "@/components/data-table";
import { Batch } from "../types";
import { useBatchList } from "../hooks/useBatches";
import { useDeleteBatch } from "../hooks/useMutateBatches";
import { ArrowUpDown, Edit, Eye, Map, Trash2 } from "lucide-react";
import { BatchFormDialog } from "./batch-form-dialog";
import { BatchDeleteDialog } from "./batch-delete-dialog";
import { BatchMoveDialog } from "./batch-move-dialog";

interface BatchTableProps {
  onCreateTrigger?: boolean;
  onCreateTriggerChange?: (val: boolean) => void;
}

export function BatchTable({ onCreateTrigger, onCreateTriggerChange }: BatchTableProps) {
  const [params, setParams] = React.useState<SpatieQueryParams>({});
  
  // Incluimos la relación paddock y livestock_count en la petición
  const queryParams = React.useMemo(() => ({
    ...params,
    include: "paddock",
  }), [params]);

  const { data: paginatedData, isLoading, error } = useBatchList(queryParams);
  const { mutate: deleteBatch, isPending: isDeleting } = useDeleteBatch();

  const [confirmDeleteId, setConfirmDeleteId] = React.useState<number | null>(null);
  const [editingBatch, setEditingBatch] = React.useState<Batch | null>(null);
  const [movingBatch, setMovingBatch] = React.useState<Batch | null>(null);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [isMoveOpen, setIsMoveOpen] = React.useState(false);

  React.useEffect(() => {
    if (onCreateTrigger) {
      setIsFormOpen(true);
      if (onCreateTriggerChange) onCreateTriggerChange(false);
    }
  }, [onCreateTrigger, onCreateTriggerChange]);

  const handleEdit = (batch: Batch) => {
    setEditingBatch(batch);
    setIsFormOpen(true);
  };

  const handleMoveClick = (batch: Batch) => {
    setMovingBatch(batch);
    setIsMoveOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setConfirmDeleteId(id);
  };

  const handleConfirmDelete = () => {
    if (confirmDeleteId !== null) {
      deleteBatch(confirmDeleteId, {
        onSuccess: () => {
          setConfirmDeleteId(null);
        },
      });
    }
  };

  const columns: ColumnDef<Batch, any>[] = React.useMemo(() => [
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
      cell: ({ row }) => <div className="font-mono text-sm text-foreground font-semibold">{row.getValue("code")}</div>,
      meta: { label: "Código" },
    },
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
      cell: ({ row }) => <div className="font-medium text-foreground">{row.getValue("name")}</div>,
      meta: { label: "Nombre" },
    },
    {
      accessorKey: "paddock",
      header: () => <span className="font-semibold text-muted-foreground">Potrero Actual</span>,
      cell: ({ row }) => {
        const paddock = row.original.paddock;
        if (!paddock) {
          return <Badge variant="outline" className="text-muted-foreground border-dashed">Sin potrero</Badge>;
        }
        return (
          <Badge className="bg-primary text-primary-foreground font-semibold">
            {paddock.name} {paddock.code ? `(${paddock.code})` : ""}
          </Badge>
        );
      },
      meta: { label: "Potrero Actual" },
    },
    {
      id: "actions",
      header: () => <span className="font-semibold text-right block pr-4 text-muted-foreground">Acciones</span>,
      cell: ({ row }) => {
        const batch = row.original;
        return (
          <div className="flex justify-end gap-2 pr-2">
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <Link href={`/dashboard/batches/${batch.id}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleMoveClick(batch)}
              className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
              title="Trasladar lote"
            >
              <Map className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEdit(batch)}
              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDeleteClick(batch.id)}
              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ], []);

  const batchData = paginatedData?.data || [];

  return (
    <>
      <DataTable
        columns={columns}
        data={batchData}
        pageCount={paginatedData?.meta?.last_page || 1}
        isLoading={isLoading}
        searchColumnKey="name"
        searchPlaceholder="Buscar por código o nombre..."
        tableId="batches-table-preferences"
        onStateChange={setParams}
      />

      <BatchFormDialog
        isOpen={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) setEditingBatch(null);
        }}
        batch={editingBatch}
      />

      <BatchMoveDialog
        isOpen={isMoveOpen}
        onOpenChange={(open) => {
          setIsMoveOpen(open);
          if (!open) setMovingBatch(null);
        }}
        batch={movingBatch}
      />

      <BatchDeleteDialog
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
