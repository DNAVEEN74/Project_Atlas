import React from 'react';

export function Tooltip({ children, text, position = 'bottom' }: { children: React.ReactNode; text: string; position?: 'top' | 'bottom' | 'left' | 'right' }) {
    if (!text) return <>{children}</>;

    const positionClasses = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2'
    };

    return (
        <div className="relative group/tooltip inline-block">
            {children}
            <div className={`absolute ${positionClasses[position]} hidden group-hover/tooltip:block z-[100] pointer-events-none transition-all`}>
                <div className="bg-neutral-900 border border-neutral-800 text-neutral-200 text-xs px-3 py-1.5 rounded-lg shadow-2xl whitespace-nowrap">
                    {text}
                </div>
            </div>
        </div>
    );
}
