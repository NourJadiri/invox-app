"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, RefreshCw, Users } from "lucide-react";

interface StudentsHeaderProps {
    studentCount: number;
    showDraft: boolean;
    onRefresh: () => void;
    onNewStudent: () => void;
}

export function StudentsHeader({
    studentCount,
    showDraft,
    onRefresh,
    onNewStudent,
}: StudentsHeaderProps) {
    return (
        <header className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-sm mb-4">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
                        </span>
                        <span>Invox</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl flex items-center gap-2">
                        <Users className="h-7 w-7" />
                        Students
                    </h1>
                    <p className="mt-3 text-base text-muted-foreground md:text-lg max-w-2xl">
                        Manage your student roster. View, add, edit, and organize all your students in one place.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={onRefresh}
                        className="gap-2"
                    >
                        <RefreshCw className="h-4 w-4" />
                        <span className="hidden sm:inline">Refresh</span>
                    </Button>
                    <Button
                        size="lg"
                        onClick={onNewStudent}
                        disabled={showDraft}
                        className="gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        New Student
                    </Button>
                </div>
            </div>

            {studentCount > 0 && (
                <div className="mt-6 flex items-center gap-4">
                    <Badge variant="secondary" className="text-sm px-3 py-1">
                        {studentCount} {studentCount === 1 ? "Student" : "Students"}
                    </Badge>
                    {showDraft && (
                        <Badge variant="default" className="text-sm px-3 py-1">
                            Draft in progress
                        </Badge>
                    )}
                </div>
            )}
        </header>
    );
}

