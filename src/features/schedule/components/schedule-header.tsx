"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, List, Plus, Check, RefreshCw, AlertTriangle } from "lucide-react";
import { useSession, signIn } from "next-auth/react";
import { checkGoogleTokenAction } from "../actions";

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
    const { data: session, status } = useSession();
    const [syncing, setSyncing] = useState(false);
    const [syncResult, setSyncResult] = useState<{ synced: number; failed: number } | null>(null);
    const [tokenStatus, setTokenStatus] = useState<"checking" | "valid" | "invalid">("checking");

    // Check token validity when session is available
    useEffect(() => {
        async function checkToken() {
            if (session?.user) {
                setTokenStatus("checking");
                const result = await checkGoogleTokenAction();
                setTokenStatus(result.valid ? "valid" : "invalid");
            }
        }

        if (status === "authenticated") {
            checkToken();
        } else if (status === "unauthenticated") {
            setTokenStatus("invalid");
        }
    }, [session, status]);

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
                // Check if the error is due to invalid token
                if (result.error.includes("invalid_grant") || result.error.includes("token")) {
                    setTokenStatus("invalid");
                }
                console.error(result.error);
            }
        } finally {
            setSyncing(false);
        }
    }

    async function handleReconnect() {
        // Sign in again with Google to get a fresh token
        await signIn("google", { callbackUrl: "/schedule" });
    }

    // Render the Google connection status buttons
    function renderGoogleButtons() {
        // Not signed in at all
        if (!session) {
            return (
                <Button variant="outline" size="lg" onClick={() => signIn("google")} className="gap-2">
                    <Calendar className="h-4 w-4" />
                    <span className="hidden sm:inline">Connect Google</span>
                </Button>
            );
        }

        // Signed in but token is invalid - need to reconnect
        if (tokenStatus === "invalid") {
            return (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReconnect}
                    className="gap-2 border-amber-500 text-amber-600 hover:bg-amber-50 dark:border-amber-400 dark:text-amber-400 dark:hover:bg-amber-950"
                >
                    <AlertTriangle className="h-4 w-4" />
                    <span className="hidden sm:inline">Reconnect Google</span>
                </Button>
            );
        }

        // Checking token status
        if (tokenStatus === "checking") {
            return (
                <Button variant="outline" size="sm" className="gap-2" disabled>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span className="hidden sm:inline">Checking...</span>
                </Button>
            );
        }

        // Token is valid - show connected status and sync button
        return (
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
        );
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
                {renderGoogleButtons()}
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
