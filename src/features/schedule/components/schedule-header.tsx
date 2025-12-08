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
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-sm mb-4">
                    <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                    </span>
                    <span>Invox</span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl flex items-center gap-2">
                    <Calendar className="h-7 w-7" />
                    Schedule
                </h1>
                <p className="mt-3 text-base text-muted-foreground md:text-lg max-w-2xl">
                    Manage your lessons and events. View in calendar or list format.
                </p>
            </div>
            <div className="flex items-center gap-2">
                {session ? (
                    <Button variant="outline" size="lg" className="gap-2" disabled>
                        <Check className="h-4 w-4" />
                        <span className="hidden sm:inline">Calendar Connected</span>
                    </Button>
                ) : (
                    <Button variant="outline" size="lg" onClick={() => signIn("google")} className="gap-2">
                        <Calendar className="h-4 w-4" />
                        <span className="hidden sm:inline">Connect Google</span>
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
                        <span className="hidden sm:inline">Calendar</span>
                    </Button>
                    <Button
                        variant={view === "list" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => onViewChange("list")}
                        className="gap-2"
                    >
                        <List className="h-4 w-4" />
                        <span className="hidden sm:inline">List</span>
                    </Button>
                </div>
                <Button size="lg" onClick={onNewLesson} className="gap-2">
                    <Plus className="h-4 w-4" />
                    New Lesson
                </Button>
            </div>
        </header>
    );
}

