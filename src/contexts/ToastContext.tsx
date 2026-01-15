'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import {
    CheckCircleOutlinedIcon,
    CancelIcon,
    InfoOutlinedIcon,
    WarningOutlinedIcon,
    CloseIcon
} from '@/components/icons';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type: ToastType) => void;
    success: (message: string) => void;
    error: (message: string) => void;
    info: (message: string) => void;
    warning: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const showToast = useCallback((message: string, type: ToastType) => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);
    }, []);

    const success = useCallback((message: string) => showToast(message, 'success'), [showToast]);
    const error = useCallback((message: string) => showToast(message, 'error'), [showToast]);
    const info = useCallback((message: string) => showToast(message, 'info'), [showToast]);
    const warning = useCallback((message: string) => showToast(message, 'warning'), [showToast]);

    return (
        <ToastContext.Provider value={{ showToast, success, error, info, warning }}>
            {children}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} {...toast} onRemove={removeToast} />
                ))}
            </div>
        </ToastContext.Provider>
    );
}

function ToastItem({ id, message, type, onRemove }: Toast & { onRemove: (id: string) => void }) {
    const [isExiting, setIsExiting] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    // We need to track the remaining time if we want to support "resuming" 
    // but for simple "stay on hover", we just clear/restart the full timer or ignore tick.
    // Simpler: Use a ref to hold the timer ID and clear/restart on hover.

    const startTimer = useCallback(() => {
        const timer = setTimeout(() => {
            setIsExiting(true);
            setTimeout(() => onRemove(id), 300); // Wait for exit animation
        }, 4000);
        return timer;
    }, [id, onRemove]);

    React.useEffect(() => {
        if (isPaused) return;
        const timer = startTimer();
        return () => clearTimeout(timer);
    }, [isPaused, startTimer]);

    const styles = {
        success: 'bg-[#1a2e23] border-emerald-500/30 text-emerald-100 shadow-emerald-900/10',
        error: 'bg-[#2e1a1a] border-red-500/30 text-red-100 shadow-red-900/10',
        info: 'bg-[#1a2333] border-blue-500/30 text-blue-100 shadow-blue-900/10',
        warning: 'bg-[#332b1a] border-amber-500/30 text-amber-100 shadow-amber-900/10'
    };

    const iconStyles = {
        success: 'bg-emerald-500/20 text-emerald-400',
        error: 'bg-red-500/20 text-red-400',
        info: 'bg-blue-500/20 text-blue-400',
        warning: 'bg-amber-500/20 text-amber-400'
    };

    return (
        <div
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className={`
                pointer-events-auto
                flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-md 
                transition-all duration-300 transform
                ${styles[type]}
                ${isExiting ? 'opacity-0 translate-x-full' : 'animate-in slide-in-from-right-full fade-in'}
            `}
            role="alert"
        >
            {/* Icon */}
            <div className={`
                flex items-center justify-center w-6 h-6 rounded-full shrink-0
                ${iconStyles[type]}
            `}>
                {type === 'success' && <CheckCircleOutlinedIcon className="w-4 h-4" />}
                {type === 'error' && <CancelIcon className="w-4 h-4" />}
                {type === 'info' && <InfoOutlinedIcon className="w-4 h-4" />}
                {type === 'warning' && <WarningOutlinedIcon className="w-4 h-4" />}
            </div>

            {/* Content */}
            <p className="text-sm font-medium pr-2 max-w-[250px]">{message}</p>

            {/* Close Button */}
            <button
                onClick={() => {
                    setIsExiting(true);
                    setTimeout(() => onRemove(id), 300);
                }}
                className="p-1 hover:bg-white/10 rounded-full transition-colors opacity-70 hover:opacity-100"
            >
                <CloseIcon className="w-4 h-4" />
            </button>
        </div>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
