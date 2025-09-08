export interface PaginationResponse<T> {
    pagination: {
        currentPage: number;
        limit: number;
        total: number;
    };
    data: T[];
}