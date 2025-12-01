"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { StudentDraftForm } from "@/features/students/components/student-draft-form";
import { emptyStudentDraft, type StudentDraft } from "@/features/students/types";
import { ArrowLeft } from "lucide-react";

export default function NewStudentPage() {
    const router = useRouter();
    const [draft, setDraft] = useState<StudentDraft>({ ...emptyStudentDraft });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        const { name, value } = e.target;
        setDraft((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const payload = {
            firstName: draft.firstName.trim(),
            lastName: draft.lastName.trim(),
            email: draft.email.trim() || null,
            phone: draft.phone.trim() || null,
            notes: draft.notes.trim() || null,
        };

        try {
            const res = await fetch("/api/students", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const data = (await res.json().catch(() => null)) as
                    | { error?: string }
                    | null;
                throw new Error(data?.error ?? "Failed to add student");
            }

            // Success! Navigate back to students list
            router.push("/students");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to add student");
        } finally {
            setLoading(false);
        }
    }

    function handleCancel() {
        router.push("/students");
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
            <main className="mx-auto max-w-7xl px-4 py-10 md:py-16">
                <header className="mb-10">
                    <Button
                        variant="ghost"
                        onClick={() => router.push("/students")}
                        className="mb-6 gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Students
                    </Button>

                    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-sm mb-4">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
                        </span>
                        <span>Invox · Draft Mode</span>
                    </div>

                    <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                        Add New Student
                    </h1>
                    <p className="mt-3 text-base text-muted-foreground md:text-lg max-w-2xl">
                        Create a draft with the student&apos;s information, then validate to add them to your roster.
                    </p>
                </header>

                <StudentDraftForm
                    draft={draft}
                    loading={loading}
                    error={error}
                    onChange={handleChange}
                    onSave={handleSave}
                    onCancel={handleCancel}
                />
            </main>
        </div>
    );
}
