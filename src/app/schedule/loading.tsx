import { Calendar, Loader2 } from "lucide-react";

export default function ScheduleLoading() {
    return (
        <div className="container mx-auto py-8 px-4">
            {/* Header skeleton */}
            <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Schedule</h1>
                    <p className="text-muted-foreground">Manage your lessons and events</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-10 w-48 animate-pulse rounded-md bg-muted" />
                    <div className="h-10 w-32 animate-pulse rounded-md bg-muted" />
                </div>
            </header>

            {/* Calendar skeleton */}
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="flex h-[700px] flex-col items-center justify-center gap-4 p-6">
                    <div className="relative">
                        <Calendar className="h-16 w-16 text-muted-foreground/30" />
                        <Loader2 className="absolute -bottom-1 -right-1 h-6 w-6 animate-spin text-primary" />
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-medium text-muted-foreground">Loading schedule...</p>
                        <p className="text-sm text-muted-foreground/60">Fetching your lessons</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
