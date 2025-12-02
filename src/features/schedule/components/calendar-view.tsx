"use client";

import { Calendar, dateFnsLocalizer, View, Views } from "react-big-calendar";
import { format } from "date-fns/format";
import { parse } from "date-fns/parse";
import { startOfWeek } from "date-fns/startOfWeek";
import { getDay } from "date-fns/getDay";
import { enUS } from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./calendar-custom.css";
import type { Lesson } from "@/features/schedule/types";
import { useState } from "react";

const locales = {
    "en-US": enUS,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

type CalendarViewProps = {
    lessons: Lesson[];
    date: Date;
    onDateChange: (date: Date) => void;
    onEditLesson: (lesson: Lesson) => void;
};

// Custom event component to display student information
const EventComponent = ({ event }: { event: { resource: Lesson; title: string } }) => {
    const lesson = event.resource;
    const studentName = lesson.student
        ? `${lesson.student.firstName} ${lesson.student.lastName}`
        : "No student";

    return (
        <div className="flex flex-col gap-0.5 overflow-hidden">
            {lesson.title && (
                <div className="font-semibold text-xs truncate">{lesson.title}</div>
            )}
            <div className="text-xs opacity-90 truncate">
                👤 {studentName}
            </div>
        </div>
    );
};

export function CalendarView({
    lessons,
    date,
    onDateChange,
    onEditLesson,
}: CalendarViewProps) {
    const [view, setView] = useState<View>(Views.MONTH);

    const events = lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title || `Lesson with ${lesson.student?.firstName} ${lesson.student?.lastName}`,
        start: new Date(lesson.start),
        end: new Date(lesson.end),
        resource: lesson,
    }));

    return (
        <div className="h-[700px] p-6">
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: "100%" }}
                date={date}
                onNavigate={onDateChange}
                view={view}
                onView={setView}
                onSelectEvent={(event) => onEditLesson(event.resource)}
                views={[Views.MONTH, Views.WEEK, Views.DAY]}
                components={{
                    event: EventComponent,
                }}
            />
        </div>
    );
}
