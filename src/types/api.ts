export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        current_page: number;
        last_page: number;
        total: number;
    };
    links: {
        next: string | null;
        prev: string | null;
    };
}