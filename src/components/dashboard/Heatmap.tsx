'use client';

import React, { useState, useMemo } from 'react';

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

    const dataMap = useMemo(() => new Map(data.map(d => [d.date, d])), [data]);

    const getIntensity = (count: number) => {
        if (count === 0) return 0;
        if (count <= 2) return 1;
        if (count <= 4) return 2;
        if (count <= 9) return 3;
        return 4;
    };

    const getIntensityColor = (intensity: number) => {
        const colors = [
            'bg-[#1f1f1f]', // Empty 
            'bg-[#005325]',  // 1
            'bg-[#008942]',  // 2
            'bg-[#6DD58C]',  // 3
            'bg-[#96F2B1]',  // 4
        ];
        return colors[intensity];
    };

    // Helper to check if a date string is in the future
    const isFutureDate = (dateStr: string) => {
        return new Date(dateStr) > new Date();
    };

    return (
        <div className={`bg-[#141414] h-full rounded-[24px] border border-[#1f1f1f] p-6 flex flex-col ${className}`}>

            {/* Header Section - Reorganized */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">

                {/* Left: Tabs & Title */}
                <div className="space-y-4">
                    {/* Tabs */}
                    <div className="flex gap-2">
                        {(['ALL', 'QUANT', 'REASONING'] as TabType[]).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-1.5 text-sm font-medium rounded-full border transition-all ${activeTab === tab
                                    ? 'bg-[#E8DEF8] text-[#1D192B] border-transparent'
                                    : 'bg-transparent text-[#CAC4D0] border-[#49454F] hover:bg-[#1D192B] hover:text-[#E6E1E5]'
                                    }`}
                            >
                                {tab === 'ALL' ? 'All' : tab === 'QUANT' ? 'Quant' : 'Reasoning'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right: Stats */}
                <div className="flex items-center gap-6 text-sm text-[#938F99]">
                    <div className="flex items-baseline gap-2">
                        <span className="text-[#E6E1E5] font-medium tracking-tight text-lg">{totalSubmissions}</span>
                        <span>submissions</span>
                    </div>
                    <span className="text-[#49454F]">•</span>
                    <div>
                        <span className="text-[#E6E1E5] font-medium tracking-tight text-lg">{active_days}</span> active days
                    </div>
                    <span className="text-[#49454F]">•</span>
                    <div>
                        Max streak <span className="text-[#E6E1E5] font-medium tracking-tight text-lg">{max_streak}</span>
                    </div>
                </div>
            </div>

            {/* Grid Container - Compact Sizing with Mobile Scroll */}
            <div className="w-full flex-1 overflow-x-auto [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:bg-neutral-800 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent flex flex-col justify-center min-h-[160px]">
                <div className="flex items-end gap-1 min-w-[700px] w-full py-6">
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
                            <div key={monthIndex} className="flex flex-col gap-1 relative group" style={{ flex: columns }}>
                                {/* Grid for this month */}
                                <div className="flex gap-[2px] w-full">
                                    {Array.from({ length: columns }).map((_, colIndex) => (
                                        <div key={colIndex} className="flex flex-col gap-[2px] flex-1">
                                            {Array.from({ length: 7 }).map((_, rowIndex) => {
                                                // Calculate actual day number
                                                const slotIndex = (colIndex * 7) + rowIndex;
                                                const dayNumber = slotIndex - startDayOfWeek + 1;

                                                const isValidDay = dayNumber > 0 && dayNumber <= daysInMonth;

                                                if (!isValidDay) {
                                                    return <div key={rowIndex} className="w-full aspect-square" />; // Empty placeholder
                                                }

                                                const dateStr = `${targetYear}-${String(targetMonth + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
                                                const isFuture = isFutureDate(dateStr);

                                                if (isFuture) {
                                                    return <div key={rowIndex} className="w-full aspect-square bg-[#0a0a0a] rounded-[2px]" />;
                                                }

                                                // Get data for this day
                                                const entry = dataMap.get(dateStr);
                                                const count = getCountForDate(entry);
                                                const intensity = getIntensity(count);

                                                // Tooltip positioning logic
                                                const isTopRow = rowIndex < 4;
                                                const isFirstFew = monthIndex === 0 && colIndex < 2;
                                                const isLastFew = monthIndex === 12 && colIndex > columns - 3;

                                                let tooltipPosition = 'left-1/2 -translate-x-1/2';
                                                let arrowPosition = 'left-1/2 -translate-x-1/2';
                                                
                                                if (isFirstFew) {
                                                    tooltipPosition = 'left-0 translate-x-0';
                                                    arrowPosition = 'left-2 translate-x-0';
                                                } else if (isLastFew) {
                                                    tooltipPosition = 'right-0 left-auto translate-x-0';
                                                    arrowPosition = 'right-2 left-auto translate-x-0';
                                                }

                                                return (
                                                    <div key={rowIndex} className="relative group/item hover:z-50 w-full">
                                                        <div
                                                            className={`w-full aspect-square rounded-[2px] transition-all duration-300 group-hover/item:scale-125 ${getIntensityColor(intensity)} cursor-default`}
                                                        />
                                                        {/* Custom Tooltip */}
                                                        <div className={`absolute ${tooltipPosition} opacity-0 group-hover/item:opacity-100 transition-all duration-200 pointer-events-none transform z-50 flex flex-col items-center
                                                            ${isTopRow
                                                                ? 'top-full mt-2 translate-y-[-8px] group-hover/item:translate-y-0'
                                                                : 'bottom-full mb-2 translate-y-2 group-hover/item:translate-y-0'
                                                            }`}>

                                                            <div className={`bg-[#36343B] text-[#E6E1E5] text-xs px-3 py-2 rounded-[16px] shadow-lg whitespace-nowrap min-w-max flex flex-col items-center gap-0.5 relative z-50 ${isTopRow ? 'order-2' : ''}`}>

                                                                {/* Arrow */}
                                                                {isTopRow ? (
                                                                    <div className={`w-2.5 h-2.5 bg-[#36343B] rotate-45 absolute -top-1.5 -z-10 ${arrowPosition}`}></div>
                                                                ) : (
                                                                    <div className={`w-2.5 h-2.5 bg-[#36343B] rotate-45 absolute -bottom-1.5 -z-10 ${arrowPosition}`}></div>
                                                                )}

                                                                <div className="font-medium text-[#E6E1E5]">
                                                                    {count} {count === 1 ? 'submission' : 'submissions'}
                                                                </div>
                                                                <div className="text-[10px] text-[#CAC4D0] font-medium bg-[#1D192B] px-2 py-1 rounded-lg mt-0.5">
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
                                <span className="text-[10px] text-[#938F99] text-center block w-full truncate mt-1 font-medium tracking-wider uppercase">
                                    {targetDate.toLocaleString('default', { month: 'short' })}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-end gap-2 mt-4">
                <span className="text-[10px] font-medium text-[#938F99]">Less</span>
                <div className="flex gap-[2px]">
                    {[0, 1, 2, 3, 4].map(i => (
                        <div key={i} className={`w-[10px] h-[10px] rounded-[2px] ${getIntensityColor(i)}`}></div>
                    ))}
                </div>
                <span className="text-[10px] font-medium text-[#938F99]">More</span>
            </div>
        </div>
    );
};

export default Heatmap;
