"use client";

import { useState, Fragment } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale/fr";
import { motion, AnimatePresence } from "motion/react";
import type { InvoiceConfig } from "@/features/invoice/types";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileDown, ChevronDown, ChevronUp, FileText } from "lucide-react";

interface InvoicePreviewProps {
    config: InvoiceConfig;
}

function getLessonDurationHours(lesson: InvoiceConfig["lessons"][0]): number {
    const startTime = new Date(lesson.start).getTime();
    const endTime = new Date(lesson.end).getTime();
    const durationMs = endTime - startTime;
    const durationHours = durationMs / (1000 * 60 * 60);
    return durationHours > 0 ? durationHours : 0;
}

function getLessonHourlyRate(lesson: InvoiceConfig["lessons"][0]): number {
    return lesson.price ?? 0;
}

function getLessonTotal(lesson: InvoiceConfig["lessons"][0]): number {
    const hours = getLessonDurationHours(lesson);
    const rate = getLessonHourlyRate(lesson);
    return hours * rate;
}

export function InvoicePreview({ config }: InvoicePreviewProps) {
    const { startDate, endDate, lessons, students, selectedStudentIds } = config;

    const [isExpanded, setIsExpanded] = useState(true);
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
        const total = studentLessons.reduce((sum, lesson) => sum + getLessonTotal(lesson), 0);
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
        <motion.section
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden"
        >
            <button
                type="button"
                className="w-full border-b px-6 py-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div className="text-left">
                        <h2 className="text-xl font-semibold tracking-tight">
                            Facture {config.number ? `#${config.number}` : ""}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Du {formattedStart} au {formattedEnd}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">Total</p>
                        <p className="text-xl font-bold">
                            {grandTotal.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                        </p>
                    </div>
                    {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                </div>
            </button>

            <AnimatePresence initial={false}>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        {/* Action bar */}
                        <div className="px-6 py-3 border-b bg-muted/20 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-xs">
                                    {selectedStudents.length} {selectedStudents.length === 1 ? "élève" : "élèves"}
                                </Badge>
                                {error && (
                                    <span className="text-xs text-destructive">{error}</span>
                                )}
                            </div>
                            <Button size="sm" className="gap-2" onClick={handleDownloadPdf} disabled={downloading}>
                                <FileDown className="h-4 w-4" />
                                {downloading ? "Génération..." : "Télécharger le PDF"}
                            </Button>
                        </div>

                        {/* Summary by student */}
                        <div className="px-6 py-4 border-b bg-muted/40">
                            <h3 className="text-sm font-semibold mb-3">Récapitulatif par élève</h3>
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

                        {/* Detailed lines - Grouped by student, sorted by date */}
                        <div className="px-4 py-4">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-40">Date</TableHead>
                                        <TableHead>Intitulé</TableHead>
                                        <TableHead className="text-right w-20">Heures</TableHead>
                                        <TableHead className="text-right w-28">Taux horaire</TableHead>
                                        <TableHead className="text-right w-28">Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {selectedStudents.map((student) => {
                                        const studentLessons = (lessonsByStudent.get(student.id) ?? [])
                                            .slice()
                                            .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
                                        const studentTotal = studentLessons.reduce((sum, lesson) => sum + getLessonTotal(lesson), 0);
                                        const studentTotalHours = studentLessons.reduce((sum, lesson) => sum + getLessonDurationHours(lesson), 0);

                                        return (
                                            <Fragment key={student.id}>
                                                {/* Student group header */}
                                                <TableRow className="bg-muted/50 hover:bg-muted/50">
                                                    <TableCell colSpan={5} className="font-semibold text-primary py-3">
                                                        {student.firstName} {student.lastName}
                                                    </TableCell>
                                                </TableRow>
                                                {/* Student lessons */}
                                                {studentLessons.map((lesson) => {
                                                    const dateLabel = format(new Date(lesson.start), "dd/MM/yyyy HH:mm", { locale: fr });
                                                    const hours = getLessonDurationHours(lesson);
                                                    const hourlyRate = getLessonHourlyRate(lesson);
                                                    const total = getLessonTotal(lesson);

                                                    const hoursLabel = hours.toLocaleString("fr-FR", {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2,
                                                    });

                                                    return (
                                                        <TableRow key={lesson.id}>
                                                            <TableCell className="pl-6">{dateLabel}</TableCell>
                                                            <TableCell className="max-w-[300px] truncate">
                                                                {lesson.title || "Leçon"}
                                                            </TableCell>
                                                            <TableCell className="text-right">{hoursLabel}</TableCell>
                                                            <TableCell className="text-right">
                                                                {hourlyRate
                                                                    ? hourlyRate.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })
                                                                    : "-"}
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                {total
                                                                    ? total.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })
                                                                    : "-"}
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                                {/* Student subtotal */}
                                                <TableRow key={`subtotal-${student.id}`} className="border-b-2">
                                                    <TableCell className="text-right font-medium text-muted-foreground" colSpan={2}>
                                                        Sous-total pour {student.firstName}
                                                    </TableCell>
                                                    <TableCell className="text-right font-medium text-muted-foreground">
                                                        {studentTotalHours.toLocaleString("fr-FR", {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        })}
                                                    </TableCell>
                                                    <TableCell></TableCell>
                                                    <TableCell className="text-right font-semibold">
                                                        {studentTotal.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                                                    </TableCell>
                                                </TableRow>
                                            </Fragment>
                                        );
                                    })}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-right font-semibold">
                                            Total dû
                                        </TableCell>
                                        <TableCell className="text-right font-bold">
                                            {grandTotal.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                                        </TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.section>
    );
}
