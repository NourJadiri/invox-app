"use client";

import { useState } from "react";
import { InvoiceHeader } from "@/features/invoice/components/invoice-header";
import { InvoiceFormDialog } from "@/features/invoice/components/invoice-form-dialog";
import { InvoicePreview } from "@/features/invoice/components/invoice-preview";
import { InvoiceList } from "@/features/invoice/components/invoice-list";
import { DeleteInvoiceDialog } from "@/features/invoice/components/delete-invoice-dialog";
import { deleteInvoiceAction } from "@/features/invoice/actions";
import type { InvoiceConfig, InvoiceLesson, InvoiceStudent } from "@/features/invoice/types";
import type { InvoiceWithStudents } from "@/services/types/invoices";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "motion/react";

interface InvoiceManagerProps {
    initialInvoices: InvoiceWithStudents[];
}

export default function InvoiceManager({ initialInvoices }: InvoiceManagerProps) {
    const router = useRouter();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [invoiceConfig, setInvoiceConfig] = useState<InvoiceConfig | null>(null);
    const [invoices, setInvoices] = useState<InvoiceWithStudents[]>(initialInvoices);
    const [error, setError] = useState<string | null>(null);
    const [loadingExisting, setLoadingExisting] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [invoiceToDelete, setInvoiceToDelete] = useState<InvoiceWithStudents | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    function handleNewInvoice() {
        setIsDialogOpen(true);
    }

    function handleInvoiceGenerated(config: InvoiceConfig) {
        setInvoiceConfig(config);
        setIsDialogOpen(false);
        setError(null);
    }

    function handleInvoiceCreated(invoice: InvoiceWithStudents) {
        // Add the new invoice to the beginning of the list
        setInvoices((prev) => [invoice, ...prev]);
    }

    async function handleSelectInvoice(invoice: InvoiceWithStudents) {
        try {
            setLoadingExisting(true);
            setError(null);

            const startDate = format(new Date(invoice.startDate), "yyyy-MM-dd");
            const endDate = format(new Date(invoice.endDate), "yyyy-MM-dd");
            const selectedStudentIds = invoice.students.map((s) => s.id);

            const params = new URLSearchParams({ start: startDate, end: endDate });
            const res = await fetch(`/api/lessons?${params.toString()}`);

            if (!res.ok) {
                throw new Error("Failed to load lessons for this invoice.");
            }

            const data = (await res.json()) as InvoiceLesson[];

            const normalizedLessons: InvoiceLesson[] = data.map((lesson) => ({
                ...lesson,
                start: new Date(lesson.start),
                end: new Date(lesson.end),
            }));

            const filteredLessons = normalizedLessons.filter((lesson) =>
                selectedStudentIds.includes(lesson.studentId),
            );

            const studentMap = new Map<string, InvoiceStudent>();
            filteredLessons.forEach((lesson) => {
                if (lesson.student) {
                    studentMap.set(lesson.student.id, lesson.student as InvoiceStudent);
                }
            });

            const students = Array.from(studentMap.values());

            if (filteredLessons.length === 0 || students.length === 0) {
                setError("No lessons were found for this invoice period and students.");
                return;
            }

            setInvoiceConfig({
                startDate,
                endDate,
                lessons: filteredLessons,
                students,
                selectedStudentIds,
            });
        } catch (err) {
            console.error(err);
            setError(
                err instanceof Error ? err.message : "An unexpected error occurred while loading the invoice.",
            );
        } finally {
            setLoadingExisting(false);
        }
    }

    function handleDeleteClick(invoice: InvoiceWithStudents) {
        setInvoiceToDelete(invoice);
        setDeleteDialogOpen(true);
    }

    async function handleDeleteConfirm() {
        if (!invoiceToDelete) return;

        try {
            setIsDeleting(true);
            const result = await deleteInvoiceAction(invoiceToDelete.id);

            if (!result.success) {
                setError(result.error || "Failed to delete invoice");
                return;
            }

            // Optimistically update the UI
            setInvoices((prev) => prev.filter((inv) => inv.id !== invoiceToDelete.id));
            setDeleteDialogOpen(false);
            setInvoiceToDelete(null);

            // Refresh the page data
            router.refresh();
        } catch (err) {
            console.error(err);
            setError("An unexpected error occurred while deleting the invoice.");
        } finally {
            setIsDeleting(false);
        }
    }

    function handleDeleteCancel() {
        setDeleteDialogOpen(false);
        setInvoiceToDelete(null);
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <InvoiceHeader onNewInvoice={handleNewInvoice} />

            <InvoiceFormDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onInvoiceGenerated={handleInvoiceGenerated}
                onInvoiceCreated={handleInvoiceCreated}
            />

            <InvoiceList
                invoices={invoices}
                onSelect={handleSelectInvoice}
                onDelete={handleDeleteClick}
            />

            <DeleteInvoiceDialog
                open={deleteDialogOpen}
                invoice={invoiceToDelete}
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
            />

            {error && (
                <p className="mt-4 text-sm text-destructive">{error}</p>
            )}

            {loadingExisting && (
                <p className="mt-2 text-xs text-muted-foreground">Loading invoice data...</p>
            )}

            {isDeleting && (
                <p className="mt-2 text-xs text-muted-foreground">Deleting invoice...</p>
            )}

            <AnimatePresence mode="wait">
                {invoiceConfig && (
                    <div className="mt-8" key={`${invoiceConfig.startDate}-${invoiceConfig.endDate}`}>
                        <InvoicePreview config={invoiceConfig} />
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
