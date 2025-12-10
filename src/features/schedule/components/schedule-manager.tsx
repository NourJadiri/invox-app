"use client";

import { useState } from "react";
import { CalendarView } from "@/features/schedule/components/calendar-view";
import { ListView } from "@/features/schedule/components/list-view";
import { LessonFormDialog } from "@/features/schedule/components/lesson-form-dialog";
import { ScheduleHeader } from "@/features/schedule/components/schedule-header";
import { syncToGoogleCalendarAction } from "@/features/schedule/actions";
import type { Lesson } from "@/features/schedule/types";
import { useRouter } from "next/navigation";

export default function ScheduleManager({ initialLessons }: { initialLessons: Lesson[] }) {
    const router = useRouter();
    const lessons = initialLessons;

    const [view, setView] = useState<"calendar" | "list">("calendar");
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

    function handleCreateLesson() {
        setSelectedLesson(null);

        setIsFormOpen(true);
    }

    function handleEditLesson(lesson: Lesson) {
        setSelectedLesson(lesson);
        setIsFormOpen(true);
    }

    async function handleSaveLesson() {
        setIsFormOpen(false);
        router.refresh();
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <ScheduleHeader
                view={view}
                onViewChange={setView}
                onNewLesson={handleCreateLesson}
                onSync={syncToGoogleCalendarAction}
            />

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
