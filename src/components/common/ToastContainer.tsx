import { ToastComponent, type Toast } from './Toast';

interface ToastContainerProps {
    toasts: Toast[];
    onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-20 right-4 z-50 flex flex-col gap-2">
            {toasts.map((toast) => (
                <ToastComponent key={toast.id} toast={toast} onClose={onRemove} />
            ))}
        </div>
    );
}


