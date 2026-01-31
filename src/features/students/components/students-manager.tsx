"use client";

import { useState } from "react";
import { StudentList } from "@/features/students/components/student-list";
import { StudentsHeader } from "@/features/students/components/students-header";
import { DeleteStudentDialog } from "@/features/students/components/delete-student-dialog";
import { emptyStudentDraft, type Student, type StudentDraft } from "@/features/students/types";
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
        
        // Handle defaultLessonPrice as number
        if (name === "defaultLessonPrice") {
            const numValue = value === "" ? null : parseFloat(value);
            setDraft((prev) => ({ ...prev, [name]: numValue }));
        } else {
            setDraft((prev) => ({ ...prev, [name]: value }));
        }
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
            defaultLessonPrice: draft.defaultLessonPrice,
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
            defaultLessonPrice: student.defaultLessonPrice ?? null,
        });
        setDraftError(null);
        setShowDraft(true);
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
            <main className="container mx-auto py-8 px-4">
                <StudentsHeader
                    studentCount={students.length}
                    showDraft={showDraft}
                    onRefresh={() => router.refresh()}
                    onNewStudent={handleNewStudent}
                />

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

            <DeleteStudentDialog
                open={deleteDialogOpen}
                student={studentToDelete}
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />
        </div>
    );
}
