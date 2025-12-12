"use client";

import { Calendar, dateFnsLocalizer, View, Views, EventProps, SlotInfo } from "react-big-calendar";
import { format } from "date-fns/format";
import { parse } from "date-fns/parse";
import { startOfWeek } from "date-fns/startOfWeek";
import { getDay } from "date-fns/getDay";
import { fr } from "date-fns/locale/fr";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../../../styles/calendar-custom.css";
import type { Lesson } from "@/features/schedule/types";
import { useState } from "react";
import EventComponent from "./EventComponent";

const locales = {
    "fr": fr,
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
    onSelectSlot?: (slotInfo: { start: Date; end: Date }) => void;
};

type CalendarEvent = {
    id: string;
    title: string;
    start: Date;
    end: Date;
    resource: Lesson;
};

export function CalendarView({
    lessons,
    date,
    onDateChange,
    onEditLesson,
    onSelectSlot,
}: CalendarViewProps) {
    const [view, setView] = useState<View>(Views.MONTH);

    const events = lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title || `Lesson with ${lesson.student?.firstName} ${lesson.student?.lastName}`,
        start: new Date(lesson.start),
        end: new Date(lesson.end),
        resource: lesson,
    }));

    // Create a view-aware event component wrapper
    const renderEvent = (props: EventProps<CalendarEvent>) => (
        <EventComponent
            event={{ resource: props.event.resource, title: props.event.title }}
            view={view}
        />
    );

    // Handle slot selection (clicking on empty time slots)
    const handleSelectSlot = (slotInfo: SlotInfo) => {
        if (onSelectSlot) {
            onSelectSlot({ start: slotInfo.start, end: slotInfo.end });
        }
    };

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
                onSelectSlot={handleSelectSlot}
                selectable={view !== Views.MONTH}
                step={60}
                timeslots={1}
                views={[Views.MONTH, Views.WEEK, Views.DAY]}
                components={{
                    event: renderEvent,
                }}
                culture="fr"
            />
        </div>
    );
}
