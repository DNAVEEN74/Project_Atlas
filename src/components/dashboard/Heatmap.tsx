'use client';

import React, { useState } from 'react';

interface HeatmapData {
    date: string;
    questions_solved: number;
    quant_solved: number;
    reasoning_solved: number;
}

interface HeatmapProps {
    data: HeatmapData[];
    active_days: number;
    max_streak: number;
    className?: string;
    selectedSubject?: 'ALL' | 'QUANT' | 'REASONING';
    onSubjectChange?: (subject: 'ALL' | 'QUANT' | 'REASONING') => void;
}

type TabType = 'ALL' | 'QUANT' | 'REASONING';

const Heatmap: React.FC<HeatmapProps> = ({ data, active_days, max_streak, className, selectedSubject = 'ALL', onSubjectChange }) => {
    // Remove internal state
    const setActiveTab = (tab: TabType) => {
        if (onSubjectChange) {
            onSubjectChange(tab);
        }
    };
    const activeTab = selectedSubject;

    const getCountForDate = (entry?: HeatmapData) => {
        if (!entry) return 0;
        if (activeTab === 'QUANT') return entry.quant_solved;
        if (activeTab === 'REASONING') return entry.reasoning_solved;
        return entry.questions_solved;
    };

    // Calculate total submissions for the selected filter
    const totalSubmissions = data.reduce((acc, curr) => {
        return acc + getCountForDate(curr);
    }, 0);

    const getIntensity = (count: number) => {
        if (count === 0) return 0;
        if (count <= 2) return 1;
        if (count <= 4) return 2;
        if (count <= 9) return 3;
        return 4;
    };

    const getIntensityColor = (intensity: number) => {
        const colors = [
            'bg-[#1E2A1E]/40', // Empty (lightened for better contrast)
            'bg-emerald-900',  // 1
            'bg-emerald-700',  // 2
            'bg-emerald-500',  // 3
            'bg-emerald-400',  // 4
        ];
        return colors[intensity];
    };

    // Helper to check if a date string is in the future
    const isFutureDate = (dateStr: string) => {
        return new Date(dateStr) > new Date();
    };

    return (
        <div className={`bg-[#1a1a1a] rounded-xl border border-neutral-800 p-6 ${className}`}>

            {/* Header Section - Reorganized */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">

                {/* Left: Tabs & Title */}
                <div className="space-y-4">
                    {/* Tabs */}
                    <div className="flex gap-1">
                        {(['ALL', 'QUANT', 'REASONING'] as TabType[]).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-3 py-1 text-[11px] font-medium rounded-full border transition-all ${activeTab === tab
                                    ? 'bg-neutral-800 text-white border-neutral-700'
                                    : 'bg-transparent text-neutral-500 border-transparent hover:text-neutral-300'
                                    }`}
                            >
                                {tab === 'ALL' ? 'All' : tab === 'QUANT' ? 'Quant' : 'Reasoning'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right: Stats */}
                <div className="flex items-center gap-6 text-xs text-neutral-500">
                    <div className="flex items-baseline gap-2">
                        <span className="text-white font-bold">{totalSubmissions}</span>
                        <span>submissions</span>
                    </div>
                    <span>•</span>
                    <div>
                        <span className="text-white font-bold">{active_days}</span> active days
                    </div>
                    <span>•</span>
                    <div>
                        Max streak <span className="text-white font-bold">{max_streak}</span>
                    </div>
                </div>
            </div>

            {/* Grid Container - Compact Sizing */}
            <div className="w-full overflow-hidden">
                <div className="flex items-end gap-1">
                    {/* Generate last 12 months */}
                    {Array.from({ length: 13 }).map((_, monthIndex) => {
                        // Logic from reference: 
                        // monthIndex 0 = 12 months ago
                        // monthIndex 12 = current month
                        const today = new Date();
                        const currentYear = today.getFullYear();
                        const currentMonth = today.getMonth(); // 0-indexed

                        // Calculate target month
                        // e.g. if current is Feb (1), index 12 is Feb. index 11 is Jan.
                        // target = currentMonth - 12 + monthIndex
                        const targetDate = new Date(currentYear, currentMonth - 12 + monthIndex, 1);
                        const targetMonth = targetDate.getMonth();
                        const targetYear = targetDate.getFullYear();

                        const daysInMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
                        const startDayOfWeek = new Date(targetYear, targetMonth, 1).getDay(); // 0 = Sun

                        // Calculate columns needed: (start offset + days) / 7
                        const totalSlots = startDayOfWeek + daysInMonth;
                        const columns = Math.ceil(totalSlots / 7);

                        return (
                            <div key={monthIndex} className="flex flex-col gap-1 relative group">
                                {/* Grid for this month */}
                                <div className="flex gap-[2px]">
                                    {Array.from({ length: columns }).map((_, colIndex) => (
                                        <div key={colIndex} className="flex flex-col gap-[2px]">
                                            {Array.from({ length: 7 }).map((_, rowIndex) => {
                                                // Calculate actual day number
                                                const slotIndex = (colIndex * 7) + rowIndex;
                                                const dayNumber = slotIndex - startDayOfWeek + 1;

                                                const isValidDay = dayNumber > 0 && dayNumber <= daysInMonth;

                                                if (!isValidDay) {
                                                    return <div key={rowIndex} className="w-[10px] h-[10px]" />; // Empty placeholder
                                                }

                                                const dateStr = `${targetYear}-${String(targetMonth + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
                                                const isFuture = isFutureDate(dateStr);

                                                if (isFuture) {
                                                    return <div key={rowIndex} className="w-[10px] h-[10px] bg-neutral-900/30 rounded-[2px]" />;
                                                }

                                                // Get data for this day
                                                const entry = data.find(heading => heading.date === dateStr);
                                                const count = getCountForDate(entry);
                                                const intensity = getIntensity(count);

                                                // Tooltip positioning logic
                                                const isTopRow = rowIndex < 2;

                                                return (
                                                    <div key={rowIndex} className="relative group/item hover:z-50">
                                                        <div
                                                            className={`w-[10px] h-[10px] rounded-[2px] transition-all duration-300 group-hover/item:scale-125 ${getIntensityColor(intensity)} cursor-default`}
                                                        />
                                                        {/* Custom Tooltip */}
                                                        <div className={`absolute left-1/2 -translate-x-1/2 opacity-0 group-hover/item:opacity-100 transition-all duration-200 pointer-events-none transform z-50 flex flex-col items-center
                                                            ${isTopRow
                                                                ? 'top-full mt-2 translate-y-[-8px] group-hover/item:translate-y-0'
                                                                : 'bottom-full mb-2 translate-y-2 group-hover/item:translate-y-0'
                                                            }`}>

                                                            <div className={`bg-[#1a1a1a] border border-neutral-700 text-white text-xs px-3 py-2 rounded-xl shadow-2xl whitespace-nowrap min-w-max flex flex-col items-center gap-0.5 relative z-50 ${isTopRow ? 'order-2' : ''}`}>

                                                                {/* Arrow */}
                                                                {isTopRow ? (
                                                                    <div className="w-2.5 h-2.5 bg-[#1a1a1a] border-l border-t border-neutral-700 rotate-45 absolute -top-1.5 left-1/2 -translate-x-1/2 -z-10"></div>
                                                                ) : (
                                                                    <div className="w-2.5 h-2.5 bg-[#1a1a1a] border-r border-b border-neutral-700 rotate-45 absolute -bottom-1.5 left-1/2 -translate-x-1/2 -z-10"></div>
                                                                )}

                                                                <div className="font-bold text-neutral-100">
                                                                    {count} {count === 1 ? 'submission' : 'submissions'}
                                                                </div>
                                                                <div className="text-[10px] text-neutral-400 font-medium bg-neutral-800/50 px-1.5 py-0.5 rounded-md mt-0.5">
                                                                    {targetDate.toLocaleString('default', { month: 'short' })} {dayNumber}, {targetYear}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                                {/* Month Label */}
                                <span className="text-[10px] text-neutral-500 text-center block w-full truncate mt-1">
                                    {targetDate.toLocaleString('default', { month: 'short' })}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-end gap-2 mt-4">
                <span className="text-[10px] text-neutral-500">Less</span>
                <div className="flex gap-[2px]">
                    {[0, 1, 2, 3, 4].map(i => (
                        <div key={i} className={`w-[10px] h-[10px] rounded-[2px] ${getIntensityColor(i)}`}></div>
                    ))}
                </div>
                <span className="text-[10px] text-neutral-500">More</span>
            </div>
        </div>
    );
};

export default Heatmap;
