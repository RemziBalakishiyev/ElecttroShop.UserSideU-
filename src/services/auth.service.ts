import { api } from './api';
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types/auth.types';

export const authService = {
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const response = await api.post<{
            accessToken: string;
            refreshToken: string;
            expiresAt: string;
            user: {
                id: string;
                email: string;
                fullName: string;
                role: string;
                isActive: boolean;
                createdAt: string;
            };
        }>('/auth/login', data);
        
        return {
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
            user: {
                id: response.data.user.id,
                email: response.data.user.email,
                name: response.data.user.fullName,
            },
        };
    },

    register: async (data: RegisterRequest): Promise<void> => {
        await api.post('/auth/register', data);
    },

    refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
        const response = await api.post<{
            accessToken: string;
            refreshToken: string;
            expiresAt: string;
        }>('/auth/refresh-token', { refreshToken });
        
        // Note: refresh token response doesn't include user, so we need to get it from storage or API
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        
        return {
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
            user: user || { id: '', email: '', name: '' },
        };
    },

    logout: async (): Promise<void> => {
        // In real app, you might want to call an endpoint to invalidate the token
        // For now, we'll just clear local storage in the context
    },
};

