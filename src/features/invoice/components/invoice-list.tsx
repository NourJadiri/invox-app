"use client";

import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale/fr";
import { motion, AnimatePresence } from "motion/react";
import type { InvoiceWithStudents } from "@/services/types/invoices";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, ChevronDown, ChevronUp, History } from "lucide-react";

interface InvoiceListProps {
    invoices: InvoiceWithStudents[];
    onSelect: (invoice: InvoiceWithStudents) => void;
    onDelete: (invoice: InvoiceWithStudents) => void;
}

export function InvoiceList({ invoices, onSelect, onDelete }: InvoiceListProps) {
    const [isExpanded, setIsExpanded] = useState(true);

    if (invoices.length === 0) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
        >
            <Card className="mt-8 overflow-hidden">
                <button
                    type="button"
                    className="w-full border-b px-6 py-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <div className="flex items-center gap-3">
                        <History className="h-5 w-5 text-muted-foreground" />
                        <div className="text-left">
                            <h2 className="text-lg font-semibold">Recent invoices</h2>
                            <p className="text-xs text-muted-foreground">
                                {invoices.length} {invoices.length === 1 ? "invoice" : "invoices"} • Click to regenerate
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                            {invoices.length}
                        </Badge>
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
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="overflow-hidden"
                        >
                            <div className="px-4 py-4">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-40">Created at</TableHead>
                                            <TableHead className="w-40">Period</TableHead>
                                            <TableHead>Students</TableHead>
                                            <TableHead className="text-right w-28">Total</TableHead>
                                            <TableHead className="w-16"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {invoices.map((invoice) => {
                                            const createdAt = new Date(invoice.createdAt);
                                            const start = new Date(invoice.startDate);
                                            const end = new Date(invoice.endDate);

                                            const createdLabel = format(createdAt, "dd MMM yyyy HH:mm", { locale: fr });
                                            const periodLabel = `${format(start, "dd/MM/yyyy", { locale: fr })} → ${format(end, "dd/MM/yyyy", { locale: fr })}`;
                                            const totalLabel = invoice.total.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });

                                            return (
                                                <TableRow
                                                    key={invoice.id}
                                                    className="cursor-pointer hover:bg-muted/60"
                                                    onClick={() => onSelect(invoice)}
                                                >
                                                    <TableCell className="text-sm text-muted-foreground">{createdLabel}</TableCell>
                                                    <TableCell className="text-sm">{periodLabel}</TableCell>
                                                    <TableCell className="text-xs">
                                                        <div className="flex flex-wrap gap-1">
                                                            {invoice.students.map((student) => (
                                                                <Badge key={student.id} variant="outline" className="text-xs">
                                                                    {student.firstName} {student.lastName}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right font-semibold">{totalLabel}</TableCell>
                                                    <TableCell>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onDelete(invoice);
                                                            }}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Card>
        </motion.div>
    );
}
