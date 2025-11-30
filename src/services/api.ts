import axios, { type AxiosError, type AxiosResponse } from 'axios';
import type { ApiResponse, ErrorResponse } from '../types/api.types';

const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:44312/api';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - Add auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor - Handle API response format and refresh token
api.interceptors.response.use(
    (response: AxiosResponse<ApiResponse<any>>) => {
        // Extract value from API response format
        if (response.data && typeof response.data === 'object' && 'isSuccess' in response.data) {
            if (response.data.isSuccess) {
                // Return the value directly, but keep pagination info
                return {
                    ...response,
                    data: response.data.value,
                    pagination: {
                        page: response.data.page,
                        pageSize: response.data.pageSize,
                        totalCount: response.data.totalCount,
                        totalPages: response.data.totalPages,
                    },
                };
            } else {
                // Handle error response
                const errorResponse = response.data as ErrorResponse;
                return Promise.reject({
                    response: {
                        ...response,
                        data: errorResponse.error,
                        status: 400,
                    },
                });
            }
        }
        return response;
    },
    async (error: AxiosError<ErrorResponse>) => {
        const originalRequest = error.config as any;

        // Handle 401 - Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (refreshToken) {
                    const refreshResponse = await axios.post<ApiResponse<{
                        accessToken: string;
                        refreshToken: string;
                        expiresAt: string;
                    }>>(`${API_URL}/auth/refresh-token`, { refreshToken });

                    if (refreshResponse.data.isSuccess) {
                        const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data.value;
                        localStorage.setItem('accessToken', accessToken);
                        localStorage.setItem('refreshToken', newRefreshToken);

                        // Retry original request
                        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                        return api(originalRequest);
                    }
                }
            } catch (refreshError) {
                // Refresh failed, logout user
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        // Handle error response format
        if (error.response?.data && 'error' in error.response.data) {
            return Promise.reject({
                ...error,
                response: {
                    ...error.response,
                    data: error.response.data.error,
                },
            });
        }

        return Promise.reject(error);
    }
);
