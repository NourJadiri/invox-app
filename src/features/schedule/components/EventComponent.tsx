// EventComponent.tsx – displays lesson title and student name for calendar events
import type { Lesson } from "@/features/schedule/types";

interface EventComponentProps {
    event: {
        resource: Lesson;
        title: string;
    };
}

const EventComponent = ({ event }: EventComponentProps) => {
    const lesson = event.resource;
    const studentName = lesson.student
        ? `${lesson.student.firstName} ${lesson.student.lastName}`
        : "No student";

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
