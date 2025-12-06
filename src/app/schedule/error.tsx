"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function ScheduleError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Schedule page error:", error);
    }, [error]);

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="flex h-[500px] flex-col items-center justify-center gap-6 p-6">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
                        <AlertTriangle className="h-10 w-10 text-destructive" />
                    </div>
                    <div className="text-center max-w-md">
                        <h2 className="text-2xl font-semibold text-foreground mb-2">
                            Failed to load schedule
                        </h2>
                        <p className="text-muted-foreground mb-6">
                            We couldn&apos;t load your lessons. This might be a temporary issue.
                            Please try again.
                        </p>
                        <Button onClick={reset} className="gap-2">
                            <RefreshCw className="h-4 w-4" />
                            Try Again
                        </Button>
                    </div>
                    {process.env.NODE_ENV === "development" && (
                        <details className="mt-4 max-w-lg text-sm">
                            <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                                Error details
                            </summary>
                            <pre className="mt-2 overflow-auto rounded-md bg-muted p-4 text-xs">
                                {error.message}
                            </pre>
                        </details>
                    )}
                </div>
            </div>
        </div>
    );
}
