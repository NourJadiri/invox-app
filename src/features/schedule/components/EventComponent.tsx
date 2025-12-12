// EventComponent.tsx – displays lesson title and student name for calendar events
import type { Lesson } from "@/features/schedule/types";
import type { View } from "react-big-calendar";

interface EventComponentProps {
    event: {
        resource: Lesson;
        title: string;
    };
    view?: View;
}

const EventComponent = ({ event, view }: EventComponentProps) => {
    const lesson = event.resource;
    const studentName = lesson.student
        ? `${lesson.student.firstName} ${lesson.student.lastName}`
        : "No student";

    // Compact view for month - just show student name in one line
    if (view === "month") {
        return (
            <div className="truncate text-[11px] leading-tight font-medium">
                {studentName}
            </div>
        );
    }

    // Full view for week/day - show title and student
    return (
        <div className="flex flex-col gap-0.5 overflow-hidden">
            {lesson.title && (
                <div className="font-semibold text-xs truncate">{lesson.title}</div>
            )}
            <div className="text-xs opacity-90 truncate">👤 {studentName}</div>
        </div>
    );
};

export default EventComponent;
