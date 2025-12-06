import { Loader2 } from "lucide-react";

export default function StudentsLoading() {
    return (
        <div className="container mx-auto py-8 px-4">
            {/* Header skeleton */}
            <header className="mb-10">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-sm mb-4">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
                            </span>
                            <span>Invox · Student Management</span>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                            Students
                        </h1>
                        <p className="mt-3 text-base text-muted-foreground md:text-lg max-w-2xl">
                            Manage your student roster. View, add, edit, and organize all your students in one place.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <div className="h-10 w-28 animate-pulse rounded-md bg-muted" />
                        <div className="h-10 w-32 animate-pulse rounded-md bg-muted" />
                    </div>
                </div>
            </header>

            {/* Grid skeleton */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div
                        key={i}
                        className="rounded-lg border bg-card p-6 shadow-sm"
                        style={{ animationDelay: `${i * 100}ms` }}
                    >
                        <div className="flex items-start gap-4">
                            <div className="h-12 w-12 animate-pulse rounded-full bg-muted" />
                            <div className="flex-1 space-y-2">
                                <div className="h-5 w-32 animate-pulse rounded bg-muted" />
                                <div className="h-4 w-48 animate-pulse rounded bg-muted" />
                            </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                            <div className="h-6 w-16 animate-pulse rounded-full bg-muted" />
                            <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Loading indicator */}
            <div className="mt-8 flex items-center justify-center gap-3 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Loading students...</span>
            </div>
        </div>
    );
}
