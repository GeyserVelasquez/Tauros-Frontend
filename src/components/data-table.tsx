"use client"

import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTableStore } from "@/store/table-store"
import { useDebounce } from "@/hooks/useDebounce"
import { mapTableStateToSpatieParams } from "@/lib/spatie-query-mapper"
import { ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export interface SpatieQueryParams {
  page?: number;
  per_page?: number;
  sort?: string;
  include?: string;
  [key: string]: any;
}

export interface DataTableFilterField {
  id: string;
  placeholder: string;
  options: { id: string | number; name: string }[];
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pageCount?: number
  isLoading?: boolean
  searchColumnKey?: string
  filterPlaceholder?: string
  tableId: string
  defaultSort?: string
  defaultIncludes?: string[]
  filterFields?: DataTableFilterField[]
  onStateChange?: (params: SpatieQueryParams) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  isLoading = false,
  searchColumnKey,
  filterPlaceholder = "Filtrar...",
  tableId,
  defaultSort,
  defaultIncludes,
  filterFields,
  onStateChange,
}: DataTableProps<TData, TValue>) {
  // Determinar si la tabla opera del lado del servidor
  const isServerSide = !!onStateChange

  // 1. Estados internos de TanStack React Table
  const [sorting, setSorting] = React.useState<SortingState>(
    defaultSort ? [{ id: defaultSort.replace("-", ""), desc: defaultSort.startsWith("-") }] : []
  )
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

  const { columnVisibility, paginationLimit, setColumnVisibility, setPaginationLimit } =
    useTableStore()

  const visibility = columnVisibility[tableId] || {}
  const pageSize = paginationLimit[tableId] || 10

  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize,
  })

  // 2. Debounce únicamente para filtros (evita peticiones en ráfaga al escribir)
  const debouncedFilters = useDebounce(columnFilters, 400)

  // Resetear al primer index de página si los filtros cambian (solo en modo servidor)
  React.useEffect(() => {
    if (isServerSide) {
      setPagination((prev) => ({ ...prev, pageIndex: 0 }))
    }
  }, [debouncedFilters, isServerSide])

  // 3. Efecto para notificar cambios de estado al servidor
  React.useEffect(() => {
    if (onStateChange) {
      const params = mapTableStateToSpatieParams(pagination, sorting, debouncedFilters, defaultIncludes)
      onStateChange(params)
    }
  }, [pagination, sorting, debouncedFilters, defaultIncludes, onStateChange])

  // Sincronizar pageSize si cambia en la base de persistencia de Zustand
  React.useEffect(() => {
    setPagination((prev) => ({ ...prev, pageSize }))
  }, [pageSize])

  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount ?? (isServerSide ? 1 : undefined),
    state: {
      sorting,
      columnFilters,
      columnVisibility: visibility,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: (updater) => {
      const nextVisibility =
        typeof updater === "function" ? updater(visibility) : updater
      setColumnVisibility(tableId, nextVisibility)
    },
    onPaginationChange: (updater) => {
      const nextPagination =
        typeof updater === "function" ? updater(pagination) : updater
      setPagination(nextPagination)
      if (nextPagination.pageSize !== pageSize) {
        setPaginationLimit(tableId, nextPagination.pageSize)
      }
    },
    manualPagination: isServerSide,
    manualSorting: isServerSide,
    manualFiltering: isServerSide,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: isServerSide ? undefined : getFilteredRowModel(),
    getPaginationRowModel: isServerSide ? undefined : getPaginationRowModel(),
    getSortedRowModel: isServerSide ? undefined : getSortedRowModel(),
  })

  const resolvedPageCount = pageCount ?? (isServerSide ? 1 : table.getPageCount())

  return (
    <div className="space-y-4">
      {/* Barra de Filtros y Selección de Columnas */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          {searchColumnKey && (
            <Input
              placeholder={filterPlaceholder}
              value={(table.getColumn(searchColumnKey)?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn(searchColumnKey)?.setFilterValue(event.target.value)
              }
              className="max-w-xs"
            />
          )}

          {filterFields?.map((field) => {
            const currentValue =
              (columnFilters.find((f) => f.id === field.id)?.value as string) ?? "all"

            return (
              <Select
                key={field.id}
                value={currentValue}
                onValueChange={(value) => {
                  setColumnFilters((prev) => {
                    const rest = prev.filter((f) => f.id !== field.id)
                    if (value && value !== "all") {
                      return [...rest, { id: field.id, value }]
                    }
                    return rest
                  })
                }}
              >
                <SelectTrigger className="w-[180px] font-montserrat text-sm">
                  <SelectValue placeholder={field.placeholder} />
                </SelectTrigger>
                <SelectContent side="top" className="font-montserrat">
                  <SelectItem value="all">{field.placeholder}</SelectItem>
                  {field.options.map((opt) => (
                    <SelectItem key={opt.id} value={String(opt.id)}>
                      {opt.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )
          })}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1.5 font-montserrat">
              Columnas <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Contenedor de la Tabla */}
      <div className="rounded-md border bg-background">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Mostrar Skeletons en cada celda para un feedback de carga táctil y moderno
              Array.from({ length: pageSize }).map((_, rowIndex) => (
                <TableRow key={`skeleton-row-${rowIndex}`}>
                  {columns.map((_, colIndex) => (
                    <TableCell key={`skeleton-col-${colIndex}`} className="py-3">
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Sin resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Controles de Paginación */}
      <div className="flex items-center justify-between px-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} fila(s) seleccionadas.
        </div>
        <div className="flex items-center gap-6 lg:gap-8">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">Filas por página</p>
            <Select
              value={`${pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value))
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={`${pageSize}`} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Página {pagination.pageIndex + 1} de{" "}
            {resolvedPageCount || 1}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={pagination.pageIndex === 0 || isLoading}
            >
              <span className="sr-only">Ir a la primera página</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={pagination.pageIndex === 0 || isLoading}
            >
              <span className="sr-only">Ir a la página anterior</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={pagination.pageIndex >= resolvedPageCount - 1 || isLoading}
            >
              <span className="sr-only">Ir a la página siguiente</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(resolvedPageCount - 1)}
              disabled={pagination.pageIndex >= resolvedPageCount - 1 || isLoading}
            >
              <span className="sr-only">Ir a la última página</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
