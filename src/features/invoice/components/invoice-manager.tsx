"use client";

import { useState } from "react";
import { InvoiceHeader } from "@/features/invoice/components/invoice-header";
import { InvoiceFormDialog } from "@/features/invoice/components/invoice-form-dialog";
import { InvoicePreview } from "@/features/invoice/components/invoice-preview";
import { InvoiceList } from "@/features/invoice/components/invoice-list";
import type { InvoiceConfig, InvoiceLesson, InvoiceStudent } from "@/features/invoice/types";
import type { InvoiceWithStudents } from "@/services/types/invoices";
import { format } from "date-fns";

interface InvoiceManagerProps {
  initialInvoices: InvoiceWithStudents[];
}

export default function InvoiceManager({ initialInvoices }: InvoiceManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [invoiceConfig, setInvoiceConfig] = useState<InvoiceConfig | null>(null);
  const [invoices] = useState<InvoiceWithStudents[]>(initialInvoices);
  const [error, setError] = useState<string | null>(null);
  const [loadingExisting, setLoadingExisting] = useState(false);

  function handleNewInvoice() {
    setIsDialogOpen(true);
  }

  function handleInvoiceGenerated(config: InvoiceConfig) {
    setInvoiceConfig(config);
    setIsDialogOpen(false);
    setError(null);
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

  return (
    <div className="container mx-auto py-8 px-4">
      <InvoiceHeader onNewInvoice={handleNewInvoice} />

      <InvoiceFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onInvoiceGenerated={handleInvoiceGenerated}
      />

      <InvoiceList invoices={invoices} onSelect={handleSelectInvoice} />

      {error && (
        <p className="mt-4 text-sm text-destructive">{error}</p>
      )}

      {loadingExisting && (
        <p className="mt-2 text-xs text-muted-foreground">Loading invoice data...</p>
      )}

      {invoiceConfig && (
        <div className="mt-8">
          <InvoicePreview config={invoiceConfig} />
        </div>
      )}
    </div>
  );
}
