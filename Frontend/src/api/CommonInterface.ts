export interface ApiResponse {
    success: boolean;
    status: number;
    message: string;
    data: any;
}

export interface Pageable {
    size: number;
    page: number;
}

export interface Page<T> {
    content: Array<T>;
    page: {
        size: number,
        number: number,
        totalElements: number,
        totalPages: number
    }
}

export interface CommonCodeSummarySimple {
    code: string;
    title: string;
}
