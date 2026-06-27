import { create } from "zustand"
import { persist } from "zustand/middleware"
import { VisibilityState } from "@tanstack/react-table"

interface TableState {
  columnVisibility: Record<string, VisibilityState>
  paginationLimit: Record<string, number>
  setColumnVisibility: (tableId: string, visibility: VisibilityState) => void
  setPaginationLimit: (tableId: string, limit: number) => void
}

export const useTableStore = create<TableState>()(
  persist(
    (set) => ({
      columnVisibility: {},
      paginationLimit: {},
      setColumnVisibility: (tableId, visibility) =>
        set((state) => ({
          columnVisibility: {
            ...state.columnVisibility,
            [tableId]: visibility,
          },
        })),
      setPaginationLimit: (tableId, limit) =>
        set((state) => ({
          paginationLimit: {
            ...state.paginationLimit,
            [tableId]: limit,
          },
        })),
    }),
    {
      name: "table-preferences-storage",
    }
  )
)
