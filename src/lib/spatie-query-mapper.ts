import { SortingState, ColumnFiltersState } from "@tanstack/react-table";
import { SpatieQueryParams } from "@/components/data-table";

/**
 * Traduce los estados de TanStack Table a parámetros de consulta (query parameters)
 * compatibles con Spatie Query Builder en el backend de Laravel.
 */
export function mapTableStateToSpatieParams(
  pagination: { pageIndex: number; pageSize: number },
  sorting: SortingState,
  columnFilters: ColumnFiltersState,
  defaultIncludes?: string[]
): SpatieQueryParams {
  const params: SpatieQueryParams = {};

  // 1. Paginación (Laravel usa índices basados en 1, TanStack en 0)
  params.page = pagination.pageIndex + 1;
  params.per_page = pagination.pageSize;

  // 2. Ordenamiento (Ejemplo: 'name' para orden ascendente, '-name' para descendente)
  if (sorting.length > 0) {
    const { id, desc } = sorting[0];
    params.sort = desc ? `-${id}` : id;
  }

  // 3. Filtros (Ejemplo: filter[brand_number]=valor)
  columnFilters.forEach((filter) => {
    if (filter.value !== undefined && filter.value !== null && filter.value !== "") {
      params[`filter[${filter.id}]`] = filter.value;
    }
  });

  // 4. Inclusiones de relaciones (Includes)
  if (defaultIncludes && defaultIncludes.length > 0) {
    params.include = defaultIncludes.join(",");
  }

  return params;
}
