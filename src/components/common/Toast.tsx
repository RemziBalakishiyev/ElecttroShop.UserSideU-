import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, XCircle } from 'lucide-react';
import { cn } from './Button';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastProps {
    toast: Toast;
    onClose: (id: string) => void;
}

const icons = {
    success: CheckCircle,
    error: XCircle,
    info: Info,
    warning: AlertCircle,
};

const styles = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
};

export function ToastComponent({ toast, onClose }: ToastProps) {
    const Icon = icons[toast.type];

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(toast.id);
        }, 5000);

        return () => clearTimeout(timer);
    }, [toast.id, onClose]);

    return (
        <div
            className={cn(
                'flex items-center gap-3 p-4 rounded-lg border shadow-lg min-w-[300px] max-w-md',
                styles[toast.type]
            )}
        >
            <Icon className="h-5 w-5 flex-shrink-0" />
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <button
                onClick={() => onClose(toast.id)}
                className="flex-shrink-0 text-current opacity-70 hover:opacity-100"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
}


