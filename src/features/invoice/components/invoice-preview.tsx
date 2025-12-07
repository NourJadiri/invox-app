"use client";

import { format } from "date-fns";
import { fr } from "date-fns/locale/fr";
import type { InvoiceConfig } from "@/features/invoice/types";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FileDown } from "lucide-react";

interface InvoicePreviewProps {
  config: InvoiceConfig;
}

function calculateHourlyPrice(lesson: InvoiceConfig["lessons"][0]): number {
  const price = lesson.price ?? 0;
  if (price === 0) return 0;

  const startTime = new Date(lesson.start).getTime();
  const endTime = new Date(lesson.end).getTime();
  const durationMs = endTime - startTime;
  const durationHours = durationMs / (1000 * 60 * 60);

  return durationHours > 0 ? price / durationHours : 0;
}

export function InvoicePreview({ config }: InvoicePreviewProps) {
  const { startDate, endDate, lessons, students, selectedStudentIds } = config;

  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedStudents = students.filter((s) => selectedStudentIds.includes(s.id));

  const lessonsByStudent = new Map<string, typeof lessons>();
  selectedStudents.forEach((student) => {
    const studentLessons = lessons.filter((lesson) => lesson.studentId === student.id);
    lessonsByStudent.set(student.id, studentLessons);
  });

  const studentTotals = selectedStudents.map((student) => {
    const studentLessons = lessonsByStudent.get(student.id) ?? [];
    const total = studentLessons.reduce((sum, lesson) => {
      const hourlyPrice = calculateHourlyPrice(lesson);
      return sum + hourlyPrice;
    }, 0);
    return { student, total };
  });

  const grandTotal = studentTotals.reduce((sum, entry) => sum + entry.total, 0);

  const formattedStart = format(new Date(startDate), "dd MMM yyyy", { locale: fr });
  const formattedEnd = format(new Date(endDate), "dd MMM yyyy", { locale: fr });

  async function handleDownloadPdf() {
    try {
      setError(null);
      setDownloading(true);

      const res = await fetch("/api/invoice/pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
      });

      if (!res.ok) {
        throw new Error("Failed to generate PDF");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "invoice.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <section className="rounded-xl border bg-card text-card-foreground shadow-sm">
      <div className="border-b px-6 py-4 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Invoice</h2>
          <p className="text-sm text-muted-foreground">
            Lessons from <span className="font-medium">{formattedStart}</span> to{" "}
            <span className="font-medium">{formattedEnd}</span>
          </p>
          {error && (
            <p className="mt-1 text-xs text-destructive">{error}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="text-right space-y-1">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Total due</p>
            <p className="text-2xl font-bold">
              {grandTotal.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
            </p>
            <Badge variant="secondary" className="text-xs w-fit">
              {selectedStudents.length} {selectedStudents.length === 1 ? "student" : "students"}
            </Badge>
          </div>
          <Button size="sm" className="mt-1 gap-2" onClick={handleDownloadPdf} disabled={downloading}>
            <FileDown className="h-4 w-4" />
            {downloading ? "Generating..." : "Download PDF"}
          </Button>
        </div>
      </div>

      {/* Summary by student */}
      <div className="px-6 py-4 border-b bg-muted/40">
        <h3 className="text-sm font-semibold mb-3">Summary by student</h3>
        <div className="flex flex-wrap gap-2">
          {studentTotals.map(({ student, total }) => (
            <Badge key={student.id} variant="outline" className="flex items-center gap-2 px-3 py-1 text-xs">
              <span>
                {student.firstName} {student.lastName}
              </span>
              <span className="font-semibold">
                {total.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
              </span>
            </Badge>
          ))}
        </div>
      </div>

      {/* Detailed lines */}
      <div className="px-4 py-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-40">Date</TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="text-right">Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lessons
              .filter((lesson) => selectedStudentIds.includes(lesson.studentId))
              .map((lesson) => {
                const student = students.find((s) => s.id === lesson.studentId);
                const dateLabel = format(new Date(lesson.start), "dd/MM/yyyy HH:mm", { locale: fr });
                const hourlyPrice = calculateHourlyPrice(lesson);
                return (
                  <TableRow key={lesson.id}>
                    <TableCell>{dateLabel}</TableCell>
                    <TableCell>
                      {student ? `${student.firstName} ${student.lastName}` : "-"}
                    </TableCell>
                    <TableCell className="max-w-[260px] truncate">
                      {lesson.title || "Lesson"}
                    </TableCell>
                    <TableCell className="text-right">
                      {hourlyPrice ? hourlyPrice.toLocaleString("fr-FR", { style: "currency", currency: "EUR" }) : "-"}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3} className="text-right font-semibold">
                Total due
              </TableCell>
              <TableCell className="text-right font-bold">
                {grandTotal.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </section>
  );
}
