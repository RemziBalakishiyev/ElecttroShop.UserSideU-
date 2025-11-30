// API Response Types
export interface ApiResponse<T> {
    isSuccess: boolean;
    isFailure: boolean;
    value: T;
    page?: number;
    pageSize?: number;
    totalCount?: number;
    totalPages?: number;
}

export interface ApiError {
    code: string;
    message: string;
    type: number;
    errors?: ValidationError[];
}

export interface ValidationError {
    code: string;
    message: string;
    property: string;
}

export interface ErrorResponse {
    isSuccess: false;
    isFailure: true;
    error: ApiError;
}

