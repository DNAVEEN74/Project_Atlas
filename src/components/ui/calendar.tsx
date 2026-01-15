import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function Calendar() {
    const [date, setDate] = React.useState(new Date())

    // Mock data for streak (active days)
    const activeDays = [2, 4, 5, 8, 11, 12, 14, 15, 18, 19, 21, 22, 25];

    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).getDay()

    const monthName = date.toLocaleString('default', { month: 'long' })
    const year = date.getFullYear()

    // Generate calendar grid
    const days = []

    // Empty slots for days before the 1st
    for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(<div key={`empty-${i}`} className="h-8 w-8" />)
    }

    // Actual days
    for (let i = 1; i <= daysInMonth; i++) {
        const isActive = activeDays.includes(i)
        const isToday = i === new Date().getDate() && date.getMonth() === new Date().getMonth()

        days.push(
            <div
                key={i}
                className={cn(
                    "h-8 w-8 flex items-center justify-center text-xs rounded-full relative cursor-pointer hover:bg-muted",
                    isToday && "text-primary font-bold border border-primary",
                )}
            >
                {i}
                {isActive && (
                    <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-green-500 rounded-full"></span>
                )}
            </div>
        )
    }

    return (
        <div className="p-3">
            <div className="flex items-center justify-between mb-4">
                <span className="font-semibold text-sm">{monthName} {year}</span>
                <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                    <div key={i} className="text-[10px] text-muted-foreground font-medium">{d}</div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
                {days}
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Study Streak Active</span>
            </div>
        </div>
    )
}
