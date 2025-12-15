"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { InvoiceConfig, InvoiceLesson, InvoiceStudent } from "@/features/invoice/types";
import type { InvoiceWithStudents } from "@/services/types/invoices";
import { Calendar, AlertCircle, Users } from "lucide-react";
import { createInvoiceAction } from "@/features/invoice/actions";
import { computeInvoiceTotal } from "@/features/invoice/utils";

interface InvoiceFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onInvoiceGenerated: (config: InvoiceConfig) => void;
    onInvoiceCreated?: (invoice: InvoiceWithStudents) => void;
}

export function InvoiceFormDialog({ open, onOpenChange, onInvoiceGenerated, onInvoiceCreated }: InvoiceFormDialogProps) {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [lessons, setLessons] = useState<InvoiceLesson[]>([]);
    const [students, setStudents] = useState<InvoiceStudent[]>([]);
    const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [step, setStep] = useState<"dates" | "students">("dates");

    function resetState() {
        setStartDate("");
        setEndDate("");
        setLessons([]);
        setStudents([]);
        setSelectedStudentIds([]);
        setLoading(false);
        setError(null);
        setStep("dates");
    }

    function handleOpenChange(next: boolean) {
        if (!next) {
            resetState();
        }
        onOpenChange(next);
    }

    async function handleLoadLessons(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (!startDate || !endDate) {
            setError("Please select both a start date and an end date.");
            return;
        }

        try {
            setLoading(true);

            const params = new URLSearchParams({ start: startDate, end: endDate });
            const res = await fetch(`/api/lessons?${params.toString()}`);

            if (!res.ok) {
                throw new Error("Failed to load lessons for this period.");
            }

            const data = (await res.json()) as InvoiceLesson[];

            // Normalize dates to Date instances to match Lesson type usage
            const normalizedLessons: InvoiceLesson[] = data.map((lesson) => ({
                ...lesson,
                start: new Date(lesson.start),
                end: new Date(lesson.end),
            }));

            setLessons(normalizedLessons);

            // Derive unique students from lessons in this period
            const studentMap = new Map<string, InvoiceStudent>();
            normalizedLessons.forEach((lesson) => {
                if (lesson.student) {
                    studentMap.set(lesson.student.id, lesson.student as InvoiceStudent);
                }
            });

            const uniqueStudents = Array.from(studentMap.values());
            setStudents(uniqueStudents);
            setSelectedStudentIds(uniqueStudents.map((s) => s.id)); // select all by default

            if (normalizedLessons.length === 0) {
                setError("No lessons were found for this date range.");
                return;
            }

            if (uniqueStudents.length === 0) {
                setError("No students were found for this date range.");
                return;
            }

            setStep("students");
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : "An unexpected error occurred while loading lessons.");
        } finally {
            setLoading(false);
        }
    }

    function toggleStudent(id: string) {
        setSelectedStudentIds((prev) =>
            prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
        );
    }

    function toggleAllStudents() {
        if (selectedStudentIds.length === students.length) {
            setSelectedStudentIds([]);
        } else {
            setSelectedStudentIds(students.map((s) => s.id));
        }
    }

    async function handleGenerateInvoice() {
        if (!startDate || !endDate) return;
        if (selectedStudentIds.length === 0) {
            setError("Please select at least one student.");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const invoiceConfig: InvoiceConfig = {
                startDate,
                endDate,
                lessons,
                students,
                selectedStudentIds,
            };

            const total = computeInvoiceTotal(invoiceConfig);

            const result = await createInvoiceAction({
                startDate,
                endDate,
                studentIds: selectedStudentIds,
                total,
            });

            if (!result.success) {
                setError(result.error ?? "Failed to save invoice record.");
                return;
            }

            // Notify parent about the new invoice for immediate UI update
            if (result.invoice && onInvoiceCreated) {
                onInvoiceCreated(result.invoice);
            }

            if (result.invoice) {
                invoiceConfig.number = result.invoice.number;
                invoiceConfig.date = new Date(result.invoice.createdAt).toISOString();
            }

            onInvoiceGenerated(invoiceConfig);
        } finally {
            setLoading(false);
        }
    }

    const allSelected = students.length > 0 && selectedStudentIds.length === students.length;

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[640px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        New Invoice
                    </DialogTitle>
                </DialogHeader>

                {/* Step 1: Date range selection */}
                {step === "dates" && (
                    <form onSubmit={handleLoadLessons} className="space-y-5 mt-4">
                        {error && (
                            <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 p-3 rounded-lg flex items-start gap-2">
                                <AlertCircle className="h-4 w-4 mt-0.5" />
                                <span className="flex-1">{error}</span>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="startDate">Start date</Label>
                            <Input
                                id="startDate"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="endDate">End date</Label>
                            <Input
                                id="endDate"
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                required
                            />
                        </div>

                        <DialogFooter className="pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleOpenChange(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? "Loading..." : "Next"}
                            </Button>
                        </DialogFooter>
                    </form>
                )}

                {/* Step 2: Student selection */}
                {step === "students" && (
                    <div className="space-y-4 mt-4">
                        {error && (
                            <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 p-3 rounded-lg flex items-start gap-2">
                                <AlertCircle className="h-4 w-4 mt-0.5" />
                                <span className="flex-1">{error}</span>
                            </div>
                        )}

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Users className="h-4 w-4" />
                                <span>
                                    {students.length} {students.length === 1 ? "student" : "students"} with lessons in
                                    this period
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={toggleAllStudents}
                                className="text-xs font-medium text-primary hover:underline"
                            >
                                {allSelected ? "Deselect all" : "Select all"}
                            </button>
                        </div>

                        <div className="rounded-md border bg-muted/30 max-h-64 overflow-y-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-10"></TableHead>
                                        <TableHead>Student</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {students.map((student) => {
                                        const checked = selectedStudentIds.includes(student.id);
                                        return (
                                            <TableRow key={student.id} className="cursor-pointer" onClick={() => toggleStudent(student.id)}>
                                                <TableCell>
                                                    <input
                                                        type="checkbox"
                                                        checked={checked}
                                                        onChange={() => toggleStudent(student.id)}
                                                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary/20 cursor-pointer"
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    {student.firstName} {student.lastName}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>

                        <DialogFooter className="pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setStep("dates")}
                            >
                                Back
                            </Button>
                            <Button onClick={handleGenerateInvoice}>
                                Generate invoice
                            </Button>
                        </DialogFooter>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
