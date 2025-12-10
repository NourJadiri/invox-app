"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, List, Plus, Check, RefreshCw } from "lucide-react";
import { useSession, signIn } from "next-auth/react";

interface ScheduleHeaderProps {
    view: "calendar" | "list";
    onViewChange: (view: "calendar" | "list") => void;
    onNewLesson: () => void;
    onSync?: () => Promise<{ success: boolean; synced?: number; failed?: number; error?: string }>;
}

export function ScheduleHeader({
    view,
    onViewChange,
    onNewLesson,
    onSync,
}: ScheduleHeaderProps) {
    const { data: session } = useSession();
    const [syncing, setSyncing] = useState(false);
    const [syncResult, setSyncResult] = useState<{ synced: number; failed: number } | null>(null);

    async function handleSync() {
        if (!onSync) return;

        setSyncing(true);
        setSyncResult(null);

        try {
            const result = await onSync();
            if (result.success && result.synced !== undefined) {
                setSyncResult({ synced: result.synced, failed: result.failed || 0 });
                // Clear the result after 5 seconds
                setTimeout(() => setSyncResult(null), 5000);
            } else if (result.error) {
                console.error(result.error);
            }
        } finally {
            setSyncing(false);
        }
    }

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
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="gap-2" disabled>
                            <Check className="h-4 w-4" />
                            <span className="hidden sm:inline">Connected</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleSync}
                            disabled={syncing}
                            className="gap-2"
                        >
                            <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
                            <span className="hidden sm:inline">
                                {syncing ? "Syncing..." : "Sync"}
                            </span>
                        </Button>
                        {syncResult && (
                            <span className="text-xs text-muted-foreground">
                                {syncResult.synced} synced
                                {syncResult.failed > 0 && `, ${syncResult.failed} failed`}
                            </span>
                        )}
                    </div>
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

