"use client";

import React from "react";
import { CloseIcon } from "@/components/icons";

export interface ActiveFiltersProps {
    filters: {
        type: "Difficulty" | "Year" | "Status" | "Topic" | "Search";
        value: string;
        label: string;
        onRemove: () => void;
    }[];
    onClearAll: () => void;
}

export function ActiveFilters({ filters, onClearAll }: ActiveFiltersProps) {
    if (filters.length === 0) return null;

    return (
        <div className="flex flex-wrap items-center gap-2 mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
            {filters.map((filter) => (
                <span
                    key={`${filter.type}-${filter.value}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1 text-sm font-medium text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded-full transition-colors hover:bg-amber-500/20 group"
                >
                    <span className="text-amber-500/70 mr-0.5">{filter.type}:</span>
                    {filter.label}
                    <button
                        onClick={filter.onRemove}
                        className="ml-1 p-0.5 text-amber-500/70 hover:text-amber-500 hover:bg-amber-500/20 rounded-full transition-colors"
                        aria-label={`Remove ${filter.type} filter`}
                    >
                        <CloseIcon sx={{ fontSize: "1rem" }} />
                    </button>
                </span>
            ))}

            {filters.length > 0 && (
                <button
                    onClick={onClearAll}
                    className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors ml-2 font-medium"
                >
                    Clear All
                </button>
            )}
        </div>
    );
}
