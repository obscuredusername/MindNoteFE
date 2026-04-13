'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAppStore } from '@/lib/app-store'
import { Calendar } from '@/components/ui/calendar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    format,
    isSameDay,
    parseISO,
    addDays,
    subDays,
    addWeeks,
    subWeeks,
    addMonths,
    subMonths,
    addYears,
    subYears,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    startOfMonth,
    endOfMonth,
    startOfYear,
    eachMonthOfInterval
} from 'date-fns'
import {
    Clock,
    CheckSquare,
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    CalendarDays
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ViewMode = 'day' | 'week' | 'month' | 'year'

export default function CalendarPage() {
    const [viewMode, setViewMode] = useState<ViewMode>('month')
    const [currentDate, setCurrentDate] = useState<Date>(new Date())
    const reminders = useAppStore((state) => state.reminders)
    const todos = useAppStore((state) => state.todos)

    // ── Navigation ────────────────────────────────────────────────

    const handlePrevious = () => {
        if (viewMode === 'day') setCurrentDate(subDays(currentDate, 1))
        else if (viewMode === 'week') setCurrentDate(subWeeks(currentDate, 1))
        else if (viewMode === 'month') setCurrentDate(subMonths(currentDate, 1))
        else if (viewMode === 'year') setCurrentDate(subYears(currentDate, 1))
    }

    const handleNext = () => {
        if (viewMode === 'day') setCurrentDate(addDays(currentDate, 1))
        else if (viewMode === 'week') setCurrentDate(addWeeks(currentDate, 1))
        else if (viewMode === 'month') setCurrentDate(addMonths(currentDate, 1))
        else if (viewMode === 'year') setCurrentDate(addYears(currentDate, 1))
    }

    const handleToday = () => setCurrentDate(new Date())

    // ── Data Helpers ──────────────────────────────────────────────

    const getItemsForDate = (date: Date) => ({
        reminders: reminders.filter(r => isSameDay(parseISO(r.dueDate), date)),
        todos: todos.filter(t => t.dueDate && isSameDay(parseISO(t.dueDate), date))
    })

    const itemDates = new Set([
        ...reminders.map(r => format(parseISO(r.dueDate), 'yyyy-MM-dd')),
        ...todos.filter(t => t.dueDate).map(t => format(parseISO(t.dueDate!), 'yyyy-MM-dd'))
    ])

    const hasItems = (date: Date) => itemDates.has(format(date, 'yyyy-MM-dd'))

    const hours = Array.from({ length: 24 }, (_, i) => i)

    // ── Render Helpers ────────────────────────────────────────────

    const renderAgendaItem = (item: any, type: 'reminder' | 'todo') => {
        if (type === 'reminder') {
            return (
                <div key={item.id} className="flex items-start gap-2 p-2 rounded border bg-accent/5 border-accent/20 text-xs">
                    <Clock className="w-3 h-3 text-accent mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{item.title}</p>
                        <p className="text-[10px] text-muted-foreground opacity-70">
                            {format(parseISO(item.dueDate), 'HH:mm')} • {item.priority}
                        </p>
                    </div>
                </div>
            )
        }
        return (
            <div key={item.id} className={cn(
                "flex items-start gap-2 p-2 rounded border text-xs",
                item.status === 'done' ? 'bg-muted/50 border-muted opacity-60' : 'bg-chart-3/5 border-chart-3/20'
            )}>
                <CheckSquare className={cn("w-3 h-3 mt-0.5 flex-shrink-0", item.status === 'done' ? 'text-muted-foreground' : 'text-chart-3')} />
                <div className="flex-1 min-w-0">
                    <p className={cn("font-semibold truncate", item.status === 'done' && "line-through")}>{item.title}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[9px] uppercase font-bold text-muted-foreground">{item.status}</span>
                        <span className="text-[9px] text-muted-foreground">{item.priority}</span>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="h-full flex flex-col space-y-6">
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Calendar</h1>
                    <p className="text-muted-foreground mt-1">
                        {viewMode === 'year' ? format(currentDate, 'yyyy') : format(currentDate, 'MMMM yyyy')}
                    </p>
                </div>

                <div className="flex items-center gap-4 bg-card border rounded-lg p-1 shadow-sm">
                    <div className="flex items-center gap-1 mr-2 px-2 border-r">
                        <Button variant="ghost" size="icon" onClick={handlePrevious} className="h-8 w-8">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" onClick={handleToday} className="h-8 text-xs font-bold px-3">
                            TODAY
                        </Button>
                        <Button variant="ghost" size="icon" onClick={handleNext} className="h-8 w-8">
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>

                    <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)} className="w-[300px]">
                        <TabsList className="grid grid-cols-4 h-8">
                            <TabsTrigger value="day" className="text-[10px] uppercase font-black tracking-tighter">Day</TabsTrigger>
                            <TabsTrigger value="week" className="text-[10px] uppercase font-black tracking-tighter">Week</TabsTrigger>
                            <TabsTrigger value="month" className="text-[10px] uppercase font-black tracking-tighter">Month</TabsTrigger>
                            <TabsTrigger value="year" className="text-[10px] uppercase font-black tracking-tighter">Year</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 min-h-0 bg-card border rounded-xl shadow-lg overflow-hidden flex flex-col">
                <Tabs value={viewMode} className="flex-1 flex flex-col h-full">
                    {/* ────── DAY VIEW ────── */}
                    <TabsContent value="day" className="flex-1 m-0 overflow-y-auto">
                        <div className="divide-y divide-border border-l group">
                            {hours.map(hour => {
                                const hourDate = new Date(currentDate)
                                hourDate.setHours(hour, 0, 0, 0)
                                const items = getItemsForDate(currentDate).reminders.filter(r => parseISO(r.dueDate).getHours() === hour)
                                const todoItems = getItemsForDate(currentDate).todos.filter(t => t.dueDate && parseISO(t.dueDate).getHours() === hour)

                                return (
                                    <div key={hour} className="flex min-h-[80px] hover:bg-muted/30 transition-colors">
                                        <div className="w-20 py-2 px-4 text-right border-r bg-muted/20">
                                            <span className="text-xs font-bold text-muted-foreground">
                                                {hour === 0 ? '12 AM' : hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                                            </span>
                                        </div>
                                        <div className="flex-1 p-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                            {items.map(r => renderAgendaItem(r, 'reminder'))}
                                            {todoItems.map(t => renderAgendaItem(t, 'todo'))}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </TabsContent>

                    {/* ────── WEEK VIEW ────── */}
                    <TabsContent value="week" className="flex-1 m-0 overflow-y-auto overflow-x-auto">
                        <div className="min-w-[800px] flex flex-col h-full">
                            <div className="flex border-b sticky top-0 bg-card z-10">
                                <div className="w-20 flex-shrink-0 bg-muted/10 border-r py-3 px-4" />
                                {eachDayOfInterval({
                                    start: startOfWeek(currentDate),
                                    end: endOfWeek(currentDate)
                                }).map(day => (
                                    <div key={day.toString()} className={cn(
                                        "flex-1 border-r py-3 px-2 text-center",
                                        isSameDay(day, new Date()) && "bg-primary/5"
                                    )}>
                                        <p className="text-[10px] font-black uppercase text-muted-foreground">{format(day, 'EEE')}</p>
                                        <p className={cn(
                                            "text-lg font-bold mt-1",
                                            isSameDay(day, new Date()) && "text-primary"
                                        )}>{format(day, 'd')}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="divide-y divide-border border-l">
                                {hours.map(hour => (
                                    <div key={hour} className="flex min-h-[60px] hover:bg-muted/10">
                                        <div className="w-20 py-2 px-4 text-right border-r bg-muted/20 flex-shrink-0">
                                            <span className="text-[10px] font-bold text-muted-foreground">
                                                {hour === 0 ? '12 AM' : hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                                            </span>
                                        </div>
                                        {eachDayOfInterval({
                                            start: startOfWeek(currentDate),
                                            end: endOfWeek(currentDate)
                                        }).map(day => {
                                            const dayItems = getItemsForDate(day).reminders.filter(r => parseISO(r.dueDate).getHours() === hour)
                                            const dayTodos = getItemsForDate(day).todos.filter(t => t.dueDate && parseISO(t.dueDate).getHours() === hour)
                                            return (
                                                <div key={day.toString()} className="flex-1 border-r p-1 space-y-1">
                                                    {dayItems.map(r => (
                                                        <div key={r.id} className="bg-accent/10 border-l-2 border-accent p-1 text-[9px] font-semibold truncate rounded-sm">
                                                            {r.title}
                                                        </div>
                                                    ))}
                                                    {dayTodos.map(t => (
                                                        <div key={t.id} className={cn(
                                                            "border-l-2 p-1 text-[9px] font-semibold truncate rounded-sm",
                                                            t.status === 'done' ? "bg-muted border-muted-foreground/30 text-muted-foreground line-through" : "bg-chart-3/10 border-chart-3 text-chart-3"
                                                        )}>
                                                            {t.title}
                                                        </div>
                                                    ))}
                                                </div>
                                            )
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </TabsContent>

                    {/* ────── MONTH VIEW ────── */}
                    <TabsContent value="month" className="flex-1 m-0 p-6 flex flex-col md:flex-row gap-8">
                        <div className="flex-1 flex justify-center items-start lg:items-center">
                            <Calendar
                                mode="single"
                                month={currentDate}
                                onMonthChange={setCurrentDate}
                                selected={currentDate}
                                onSelect={(d) => d && setCurrentDate(d)}
                                modifiers={{
                                    hasItems: (date) => hasItems(date)
                                }}
                                modifiersClassNames={{
                                    hasItems: "before:content-[''] before:absolute before:bottom-1 before:left-1/2 before:-translate-x-1/2 before:w-1.5 before:h-1.5 before:bg-primary before:rounded-full shadow-sm ring-1 ring-primary/20"
                                }}
                                className="rounded-xl border shadow-2xl p-6 bg-card"
                            />
                        </div>
                        <Card className="w-full md:w-80 shadow-lg border-primary/20 bg-background/50 backdrop-blur-sm self-stretch flex flex-col">
                            <CardHeader className="py-4 border-b">
                                <CardTitle className="text-sm font-black tracking-widest uppercase text-primary">Agenda • {format(currentDate, 'MMM d')}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 space-y-4 flex-1 overflow-y-auto">
                                {getItemsForDate(currentDate).reminders.map(r => renderAgendaItem(r, 'reminder'))}
                                {getItemsForDate(currentDate).todos.map(t => renderAgendaItem(t, 'todo'))}
                                {getItemsForDate(currentDate).reminders.length + getItemsForDate(currentDate).todos.length === 0 && (
                                    <div className="py-12 text-center text-muted-foreground">
                                        <CalendarDays className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                        <p className="text-xs">No entries for today</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* ────── YEAR VIEW ────── */}
                    <TabsContent value="year" className="flex-1 m-0 overflow-y-auto p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {eachMonthOfInterval({
                                start: startOfYear(currentDate),
                                end: endOfMonth(startOfYear(addMonths(currentDate, 11)))
                            }).map(monthDate => (
                                <Card key={monthDate.toString()} className="border shadow-sm hover:border-primary/50 transition-colors">
                                    <Calendar
                                        mode="single"
                                        month={monthDate}
                                        disableNavigation
                                        modifiers={{
                                            hasItems: (date) => hasItems(date)
                                        }}
                                        modifiersClassNames={{
                                            hasItems: "bg-primary/10 font-bold text-primary"
                                        }}
                                        className="p-3 cursor-default pointer-events-none"
                                        classNames={{
                                            month_caption: "text-xs font-black uppercase mb-2",
                                            table: "text-[10px]",
                                            day: "h-7 w-7 p-0"
                                        }}
                                    />
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
