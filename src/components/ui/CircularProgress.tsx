import React from 'react';

interface CircularProgressProps {
    value: number; // 0 to 100
    size?: number;
    strokeWidth?: number;
    color?: string; // Valid Tailwind text color class, e.g., 'text-amber-500'
    trackColor?: string; // e.g., 'text-neutral-800'
    children?: React.ReactNode;
}

export const CircularProgress = ({
    value,
    size = 120,
    strokeWidth = 10,
    color = 'text-amber-500',
    trackColor = 'text-neutral-800',
    children
}: CircularProgressProps) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (value / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            {/* SVG Circle */}
            <svg className="transform -rotate-90 w-full h-full">
                {/* Track */}
                <circle
                    className={trackColor}
                    strokeWidth={strokeWidth}
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                {/* Progress */}
                <circle
                    className={`${color} transition-all duration-1000 ease-out`}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
            </svg>

            {/* Inner Content */}
            {children && (
                <div className="absolute inset-0 flex items-center justify-center">
                    {children}
                </div>
            )}
        </div>
    );
};
