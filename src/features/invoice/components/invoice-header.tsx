"use client";

import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";

interface InvoiceHeaderProps {
    onNewInvoice: () => void;
}

export function InvoiceHeader({ onNewInvoice }: InvoiceHeaderProps) {
    return (
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-sm mb-4">
                    <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                    </span>
                    <span>Invox</span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl flex items-center gap-2">
                    <FileText className="h-7 w-7" />
                    Invoice
                </h1>
                <p className="mt-3 text-base text-muted-foreground md:text-lg max-w-2xl">
                    Generate an invoice from your lessons by selecting a date range and the students to bill.
                </p>
            </div>
            <div className="flex gap-3">
                <Button size="lg" onClick={onNewInvoice} className="gap-2">
                    <Plus className="h-4 w-4" />
                    New Invoice
                </Button>
            </div>
        </header>
    );
}
