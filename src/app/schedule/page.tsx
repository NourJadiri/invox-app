"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, List, Plus, Check } from "lucide-react";
import { CalendarView } from "@/features/schedule/components/calendar-view";
import { ListView } from "@/features/schedule/components/list-view";
import { LessonFormDialog } from "@/features/schedule/components/lesson-form-dialog";
import type { Lesson } from "@/features/schedule/types";
import { startOfMonth, endOfMonth, subMonths, addMonths } from "date-fns";
import { useSession, signIn } from "next-auth/react";

export default function SchedulePage() {
    const { data: session } = useSession();
    const [view, setView] = useState<"calendar" | "list">("calendar");
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

    const loadLessons = useCallback(async () => {
        setLoading(true);
        try {
            // Fetch lessons for a wide range around current date to be safe
            // Ideally we'd fetch based on the current view's visible range
            const start = startOfMonth(subMonths(currentDate, 1)).toISOString();
            const end = endOfMonth(addMonths(currentDate, 1)).toISOString();

            const res = await fetch(`/api/lessons?start=${start}&end=${end}`);
            if (!res.ok) throw new Error("Failed to load lessons");
            const data = await res.json();
            setLessons(data);
        } catch (error) {
            console.error("Failed to load lessons:", error);
        } finally {
            setLoading(false);
        }
    }, [currentDate]);

    useEffect(() => {
        void loadLessons();
    }, [loadLessons]);

    function handleCreateLesson() {
        setSelectedLesson(null);
        setIsFormOpen(true);
    }

    function handleEditLesson(lesson: Lesson) {
        setSelectedLesson(lesson);
        setIsFormOpen(true);
    }

    async function handleSaveLesson() {
        await loadLessons();
        setIsFormOpen(false);
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Schedule</h1>
                    <p className="text-muted-foreground">Manage your lessons and events</p>
                </div>
                <div className="flex items-center gap-2">
                    {session ? (
                        <Button variant="outline" className="gap-2" disabled>
                            <Check className="h-4 w-4" />
                            Calendar Connected
                        </Button>
                    ) : (
                        <Button variant="outline" onClick={() => signIn("google")} className="gap-2">
                            <Calendar className="h-4 w-4" />
                            Connect Google Calendar
                        </Button>
                    )}
                    <div className="flex items-center rounded-md border bg-muted/50 p-1">
                        <Button
                            variant={view === "calendar" ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => setView("calendar")}
                            className="gap-2"
                        >
                            <Calendar className="h-4 w-4" />
                            Calendar
                        </Button>
                        <Button
                            variant={view === "list" ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => setView("list")}
                            className="gap-2"
                        >
                            <List className="h-4 w-4" />
                            List
                        </Button>
                    </div>
                    <Button onClick={handleCreateLesson} className="gap-2">
                        <Plus className="h-4 w-4" />
                        New Lesson
                    </Button>
                </div>
            </header>

            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                {view === "calendar" ? (
                    <CalendarView
                        lessons={lessons}
                        date={currentDate}
                        onDateChange={setCurrentDate}
                        onEditLesson={handleEditLesson}
                    />
                ) : (
                    <ListView
                        lessons={lessons}
                        onEditLesson={handleEditLesson}
                    />
                )}
            </div>

            <LessonFormDialog
                open={isFormOpen}
                onOpenChange={setIsFormOpen}
                lesson={selectedLesson}
                onSave={handleSaveLesson}
            />
        </div>
    );
}
