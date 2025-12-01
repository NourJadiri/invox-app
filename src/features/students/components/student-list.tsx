"use client";

import { StudentCard } from "./student-card";
import { StudentDraftCard } from "./student-draft-card";
import { UserPlus } from "lucide-react";
import type { Student, StudentDraft } from "../types";

type StudentListProps = {
    students: Student[];
    showDraft: boolean;
    draftMode: "new" | "edit";
    studentIdBeingEdited: string | null;
    draft: StudentDraft;
    draftLoading: boolean;
    draftError: string | null;
    onDraftChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onDraftValidate: () => void;
    onDraftCancel: () => void;
    onEdit: (student: Student) => void;
    onDelete: (id: string) => void;
};

export function StudentList({
    students,
    showDraft,
    draftMode,
    studentIdBeingEdited,
    draft,
    draftLoading,
    draftError,
    onDraftChange,
    onDraftValidate,
    onDraftCancel,
    onEdit,
    onDelete,
}: StudentListProps) {
    const isEmpty = students.length === 0 && !showDraft;

    if (isEmpty) {
        return (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 px-6 py-16 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <UserPlus className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">
                    No students yet
                </h3>
                <p className="text-sm text-muted-foreground max-w-md">
                    Get started by adding your first student. Click the &quot;New Student&quot; button above to begin.
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Show draft card ONLY for new students (not editing) */}
            {showDraft && draftMode === "new" && (
                <StudentDraftCard
                    draft={draft}
                    loading={draftLoading}
                    error={draftError}
                    mode="new"
                    onChange={onDraftChange}
                    onValidate={onDraftValidate}
                    onCancel={onDraftCancel}
                />
            )}

            {/* For each student, show either the draft card (if editing) or the regular card */}
            {students.map((student) => {
                const isBeingEdited = studentIdBeingEdited === student.id;

                if (isBeingEdited) {
                    return (
                        <StudentDraftCard
                            key={student.id}
                            draft={draft}
                            loading={draftLoading}
                            error={draftError}
                            mode="edit"
                            onChange={onDraftChange}
                            onValidate={onDraftValidate}
                            onCancel={onDraftCancel}
                        />
                    );
                }

                return (
                    <StudentCard
                        key={student.id}
                        student={student}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                );
            })}
        </div>
    );
}
