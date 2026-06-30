const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL && import.meta.env.PROD) {
    throw new Error('VITE_API_BASE_URL is required in production');
}

export const apiBaseUrl = API_BASE_URL || 'http://localhost:5000/api';
