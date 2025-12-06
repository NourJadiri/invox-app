"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { StudentList } from "@/features/students/components/student-list";
import { emptyStudentDraft, type Student, type StudentDraft } from "@/features/students/types";
import { Plus, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { createStudentAction, deleteStudentAction, updateStudentAction } from "../actions";

export default function StudentsManager({ initialStudents }: { initialStudents: Student[] }) {

    const router = useRouter();
    const students = initialStudents;



    // Draft state
    const [showDraft, setShowDraft] = useState(false);
    const [draftMode, setDraftMode] = useState<"new" | "edit">("new");
    const [draft, setDraft] = useState<StudentDraft>({ ...emptyStudentDraft });
    const [draftLoading, setDraftLoading] = useState(false);
    const [draftError, setDraftError] = useState<string | null>(null);
    const [studentBeingEdited, setStudentBeingEdited] = useState<Student | null>(null);

    // Delete confirmation dialog state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);


    function handleNewStudent() {
        setDraftMode("new");
        setShowDraft(true);
        setDraft({ ...emptyStudentDraft });
        setDraftError(null);
        setStudentBeingEdited(null);
    }

    function handleDraftChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        const { name, value } = e.target;
        setDraft((prev) => ({ ...prev, [name]: value }));
    }

    async function handleDraftValidate() {
        setDraftLoading(true);
        setDraftError(null);

        const payload = {
            firstName: draft.firstName.trim(),
            lastName: draft.lastName.trim(),
            email: draft.email.trim() || null,
            phone: draft.phone.trim() || null,
            notes: draft.notes.trim() || null,
        }

        try {

            let result;

            if (draftMode == "edit" && studentBeingEdited) {
                result = await updateStudentAction(
                    studentBeingEdited.id,
                    payload
                );
            }
            else {
                result = await createStudentAction(payload);
            }

            if (!result.success) {
                throw new Error(result.error);
            }

            setShowDraft(false);
            setDraft({ ...emptyStudentDraft });
            setStudentBeingEdited(null);

        }
        catch (error) {
            setDraftError(error instanceof Error ? error.message : "Failed to save student. Please try again later.");
        }
        finally {
            setDraftLoading(false);
        }
    }

    function handleDraftCancel() {
        setShowDraft(false);
        setDraft({ ...emptyStudentDraft });
        setDraftError(null);
        setStudentBeingEdited(null);
    }


    async function confirmDelete() {
        if (!studentToDelete) return;

        try {
            const res = await deleteStudentAction(studentToDelete.id);
            if (!res.success) {
                throw new Error(res.error);
            }

        } catch (err) {
            setDraftError(err instanceof Error ? err.message : "Failed to delete student");
        } finally {
            setDeleteDialogOpen(false);
            setStudentToDelete(null);
        }
    }

    function handleDelete(id: string) {
        const student = students.find(s => s.id === id);
        if (student) {
            setStudentToDelete(student);
            setDeleteDialogOpen(true);
        }
    }


    function cancelDelete() {
        setDeleteDialogOpen(false);
        setStudentToDelete(null);
    }

    function handleEdit(student: Student) {
        setDraftMode("edit");
        setStudentBeingEdited(student);
        setDraft({
            firstName: student.firstName,
            lastName: student.lastName,
            email: student.email || "",
            phone: student.phone || "",
            notes: student.notes || "",
        });
        setDraftError(null);
        setShowDraft(true);
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
            <main className="mx-auto max-w-7xl px-4 py-10 md:py-16">
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
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={() => router.refresh()}
                                className="gap-2"
                            >
                                <RefreshCw className="h-4 w-4" />
                                <span className="hidden sm:inline">Refresh</span>
                            </Button>
                            <Button
                                size="lg"
                                onClick={handleNewStudent}
                                disabled={showDraft}
                                className="gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                New Student
                            </Button>
                        </div>
                    </div>

                    {students.length > 0 && (
                        <div className="mt-6 flex items-center gap-4">
                            <Badge variant="secondary" className="text-sm px-3 py-1">
                                {students.length} {students.length === 1 ? "Student" : "Students"}
                            </Badge>
                            {showDraft && (
                                <Badge variant="default" className="text-sm px-3 py-1">
                                    Draft in progress
                                </Badge>
                            )}
                        </div>
                    )}
                </header>

                <StudentList
                    students={students}
                    showDraft={showDraft}
                    draftMode={draftMode}
                    studentIdBeingEdited={studentBeingEdited?.id ?? null}
                    draft={draft}
                    draftLoading={draftLoading}
                    draftError={draftError}
                    onDraftChange={handleDraftChange}
                    onDraftValidate={handleDraftValidate}
                    onDraftCancel={handleDraftCancel}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </main>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Student?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete{" "}
                            <span className="font-semibold text-foreground">
                                {studentToDelete?.firstName} {studentToDelete?.lastName}
                            </span>
                            ? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={cancelDelete}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
