"use client";

import { Button } from "@/components/ui/button";
import { Calendar, List, Plus, Check } from "lucide-react";
import { useSession, signIn } from "next-auth/react";

interface ScheduleHeaderProps {
    view: "calendar" | "list";
    onViewChange: (view: "calendar" | "list") => void;
    onNewLesson: () => void;
}

export function ScheduleHeader({
    view,
    onViewChange,
    onNewLesson,
}: ScheduleHeaderProps) {
    const { data: session } = useSession();

    return (
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
                        onClick={() => onViewChange("calendar")}
                        className="gap-2"
                    >
                        <Calendar className="h-4 w-4" />
                        Calendar
                    </Button>
                    <Button
                        variant={view === "list" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => onViewChange("list")}
                        className="gap-2"
                    >
                        <List className="h-4 w-4" />
                        List
                    </Button>
                </div>
                <Button onClick={onNewLesson} className="gap-2">
                    <Plus className="h-4 w-4" />
                    New Lesson
                </Button>
            </div>
        </header>
    );
}
