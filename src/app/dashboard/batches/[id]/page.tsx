"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Map, Calendar, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useBatchById } from "@/features/batches/hooks/useBatches";
import { useLivestockList } from "@/features/livestock/hooks/useLivestock";
import { BatchMoveDialog } from "@/features/batches/components/batch-move-dialog";
import { DataTable, SpatieQueryParams } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Livestock } from "@/features/livestock";

export default function BatchDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: batch, isLoading: isBatchLoading, error: batchError } = useBatchById(id, { include: "paddock" });

  const [livestockParams, setLivestockParams] = React.useState<SpatieQueryParams>({});

  const combinedParams = React.useMemo(() => ({
    ...livestockParams,
    "filter[batch_id]": id,
    include: "paddock,breed",
  }), [livestockParams, id]);

  const { data: paginatedLivestock, isLoading: isLivestockLoading, error: livestockError } = useLivestockList(combinedParams);

  const [isMoveOpen, setIsMoveOpen] = React.useState(false);

  const columns: ColumnDef<Livestock, any>[] = React.useMemo(() => [
    {
      accessorKey: "brand_number",
      header: () => <span className="font-semibold text-muted-foreground">Marca / Arete</span>,
      cell: ({ row }) => <div className="font-semibold tracking-wider text-foreground">{row.getValue("brand_number")}</div>,
    },
    {
      accessorKey: "name",
      header: () => <span className="font-semibold text-muted-foreground">Nombre</span>,
      cell: ({ row }) => <div>{row.getValue("name") || "—"}</div>,
    },
    {
      accessorKey: "animal_category",
      header: () => <span className="font-semibold text-muted-foreground">Categoría</span>,
      cell: ({ row }) => {
        const cat = row.getValue("animal_category") as string;
        const labels: Record<string, string> = {
          bull: "Toro", cow: "Vaca", steer: "Novillo", heifer: "Novilla",
          male_yearling: "Maute", female_yearling: "Mauta",
          bull_calf: "Becerro", heifer_calf: "Becerra"
        };
        return <div className="capitalize">{labels[cat] || cat}</div>;
      },
    },
    {
      accessorKey: "paddock",
      header: () => <span className="font-semibold text-muted-foreground">Potrero Físico</span>,
      cell: ({ row }) => {
        const paddock = row.original.paddock;
        if (!paddock) {
          return <Badge variant="outline" className="text-muted-foreground border-dashed">Sin potrero</Badge>;
        }
        return (
          <Badge variant="secondary" className="font-semibold">
            {paddock.name} {paddock.code ? `(${paddock.code})` : ""}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: () => <span className="font-semibold text-right block pr-4 text-muted-foreground">Ver Ficha</span>,
      cell: ({ row }) => (
        <div className="flex justify-end pr-2">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <Link href={`/dashboard/livestock/${row.original.id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      ),
    },
  ], []);

  if (isBatchLoading) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-6 font-montserrat">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (batchError || !batch) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-6 font-montserrat text-center justify-center items-center py-20">
        <h2 className="text-2xl font-bold text-destructive">Error al cargar el lote</h2>
        <p className="text-muted-foreground">El lote que buscas no existe o fue eliminado.</p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/batches">Volver a Lotes</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 font-montserrat">
      {/* Volver */}
      <div>
        <Button asChild variant="ghost" size="sm" className="mb-2 pl-0 text-muted-foreground hover:text-foreground">
          <Link href="/dashboard/batches">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Lotes
          </Link>
        </Button>

        {/* Cabecera */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">{batch.name}</h1>
              <Badge variant="outline" className="font-mono text-sm tracking-wider">{batch.code}</Badge>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Map className="h-4 w-4" />
                Potrero:{" "}
                {batch.paddock ? (
                  <strong className="text-foreground">
                    {batch.paddock.name} {batch.paddock.code ? `(${batch.paddock.code})` : ""}
                  </strong>
                ) : (
                  <span className="italic">Sin asignar</span>
                )}
              </span>
            </div>
          </div>
          <Button
            onClick={() => setIsMoveOpen(true)}
            className="bg-primary hover:bg-primary/95 text-primary-foreground active:scale-95 transition-transform"
          >
            <Map className="mr-2 h-4 w-4" />
            Trasladar Lote
          </Button>
        </div>
      </div>

      <Separator />

      {/* Listado de Animales */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-bold text-foreground">Animales en este Lote</h3>
          <p className="text-sm text-muted-foreground">
            Listado de animales que pertenecen administrativamente a este grupo y su ubicación física actual.
          </p>
        </div>
        <DataTable
          columns={columns}
          data={paginatedLivestock?.data || []}
          pageCount={paginatedLivestock?.meta?.last_page || 1}
          isLoading={isLivestockLoading}
          searchColumnKey="brand_number"
          searchPlaceholder="Buscar por marca o nombre..."
          tableId="batch-livestock-table-preferences"
          onStateChange={setLivestockParams}
        />
      </div>

      <BatchMoveDialog
        isOpen={isMoveOpen}
        onOpenChange={setIsMoveOpen}
        batch={batch}
      />
    </div>
  );
}
