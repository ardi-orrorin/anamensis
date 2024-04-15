export interface PageI {
    page: number;
    size: number;
    total: number;
    criteria: string;
    order?: string;
    endPage: boolean;
    getOffset: number;
}

