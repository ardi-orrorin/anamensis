export interface PageResponse<T> {
    page: PageI;
    content: T[];
}

export interface PageI {
    page: number;
    size: number;
    total: number;
    criteria: string;
    order?: string;
    endPage: boolean;
    getOffset: number;
}

