import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, LoginRequest, RegisterRequest } from '../types/auth.types';
import { authService } from '../services/auth.service';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (data: LoginRequest) => Promise<void>;
    register: (data: RegisterRequest) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('accessToken');
            const userStr = localStorage.getItem('user');
            if (token && userStr) {
                try {
                    const user = JSON.parse(userStr);
                    setUser(user);
                } catch (error) {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    localStorage.removeItem('user');
                }
            }
            setIsLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (data: LoginRequest) => {
        const response = await authService.login(data);
        const { accessToken, refreshToken, user } = response;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
    };

    const register = async (data: RegisterRequest) => {
        await authService.register(data);
        // Auto login or redirect to login
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
