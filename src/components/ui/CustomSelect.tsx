"use client"

import React, { useState, useRef, useEffect } from 'react';
import { ExpandMoreIcon } from '@/components/icons';

interface Option {
    value: string;
    label: string;
}

interface CustomSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: Option[];
    placeholder?: string;
    className?: string;
    icon?: React.ReactNode;
}

export function CustomSelect({ value, onChange, options, placeholder, className, icon }: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedLabel = options.find(opt => opt.value === value)?.label || placeholder || value;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-[#1a1a1a] border border-neutral-800 rounded-xl text-neutral-200 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all text-sm group"
            >
                <span className={`flex items-center gap-2 ${!options.find(opt => opt.value === value) && placeholder ? 'text-neutral-400' : ''}`}>
                    {icon && <span className="text-neutral-500">{icon}</span>}
                    {selectedLabel}
                </span>
                <span className={`text-neutral-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    <ExpandMoreIcon sx={{ fontSize: '1.2rem' }} />
                </span>
            </button>

            {isOpen && (
                <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-[#1a1a1a] border border-neutral-800 rounded-xl shadow-xl shadow-black/50 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="py-1 max-h-60 overflow-y-auto custom-scrollbar">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between
                                    ${option.value === value
                                        ? 'bg-amber-500/10 text-amber-500 font-medium'
                                        : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
                                    }`}
                            >
                                {option.label}
                                {option.value === value && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
