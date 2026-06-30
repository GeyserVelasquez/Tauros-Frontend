"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { Payment } from "../types"
import { usePayments } from "../hooks/usePayments"
import { ArrowUpDown, Copy, MoreHorizontal } from "lucide-react"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"

export const columns: ColumnDef<Payment>[] = [
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
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-3"
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
        success: "default",
        pending: "secondary",
        processing: "outline",
        failed: "destructive",
      }

      const labels: Record<string, string> = {
        success: "Exitoso",
        pending: "Pendiente",
        processing: "Procesando",
        failed: "Fallido",
      }

      return (
        <Badge variant={variants[status] || "secondary"} className="capitalize">
          {labels[status] || status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-mr-3 ml-auto"
          >
            Monto
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      const formatted = new Intl.NumberFormat("es-VE", {
        style: "currency",
        currency: "USD",
      }).format(amount)

      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "createdAt",
    header: "Fecha de Creación",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"))
      const formatted = date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
      return <div className="text-sm text-muted-foreground">{formatted}</div>
    },
  },
  {
    id: "acciones",
    cell: ({ row }) => {
      const payment = row.original

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
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(payment.id)
                toast.success("ID copiado al portapapeles")
              }}
            >
              <Copy className="mr-2 h-4 w-4" />
              Copiar ID de Pago
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Ver detalles</DropdownMenuItem>
            <DropdownMenuItem>Ver cliente</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function PaymentsTable() {
  const { data, isLoading, error } = usePayments()

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-[250px]" />
        <Skeleton className="h-[300px] w-full rounded-md" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        Error al cargar los pagos. Por favor intenta de nuevo.
      </div>
    )
  }

  return (
    <DataTable
      columns={columns}
      data={data || []}
      searchColumnKey="email"
      searchPlaceholder="Buscar por email..."
      tableId="payments-table-preferences"
    />
  )
}
