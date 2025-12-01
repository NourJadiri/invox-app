"use client";

import { format, isSameDay } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Clock, User } from "lucide-react";
import type { Lesson } from "@/features/schedule/types";

type ListViewProps = {
    lessons: Lesson[];
    onEditLesson: (lesson: Lesson) => void;
};

export function ListView({ lessons, onEditLesson }: ListViewProps) {
    // Sort lessons by start date
    const sortedLessons = [...lessons].sort(
        (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
    );

    // Group lessons by day
    const groupedLessons: { date: Date; lessons: Lesson[] }[] = [];

    sortedLessons.forEach((lesson) => {
        const date = new Date(lesson.start);
        const lastGroup = groupedLessons[groupedLessons.length - 1];

        if (lastGroup && isSameDay(lastGroup.date, date)) {
            lastGroup.lessons.push(lesson);
        } else {
            groupedLessons.push({ date, lessons: [lesson] });
        }
    });

    if (sortedLessons.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                <p>No upcoming lessons found.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-4">
            {groupedLessons.map((group) => (
                <div key={group.date.toISOString()} className="space-y-2">
                    <h3 className="font-semibold text-lg text-foreground sticky top-0 bg-background/95 backdrop-blur py-2 z-10">
                        {format(group.date, "EEEE, MMMM d, yyyy")}
                    </h3>
                    <div className="grid gap-3">
                        {group.lessons.map((lesson) => (
                            <Card key={lesson.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="flex items-center justify-between p-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 font-medium">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                            <span>
                                                {format(new Date(lesson.start), "h:mm a")} -{" "}
                                                {format(new Date(lesson.end), "h:mm a")}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <User className="h-4 w-4" />
                                            <span>
                                                {lesson.student?.firstName} {lesson.student?.lastName}
                                            </span>
                                        </div>
                                        {lesson.title && (
                                            <p className="text-sm font-medium text-primary">
                                                {lesson.title}
                                            </p>
                                        )}
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onEditLesson(lesson)}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
