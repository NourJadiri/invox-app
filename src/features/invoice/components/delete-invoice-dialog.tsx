"use client";

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
import type { InvoiceWithStudents } from "@/services/types/invoices";
import { format } from "date-fns";
import { fr } from "date-fns/locale/fr";

interface DeleteInvoiceDialogProps {
    open: boolean;
    invoice: InvoiceWithStudents | null;
    onConfirm: () => void;
    onCancel: () => void;
}

export function DeleteInvoiceDialog({
    open,
    invoice,
    onConfirm,
    onCancel,
}: DeleteInvoiceDialogProps) {
    const periodLabel = invoice
        ? `${format(new Date(invoice.startDate), "dd/MM/yyyy", { locale: fr })} → ${format(new Date(invoice.endDate), "dd/MM/yyyy", { locale: fr })}`
        : "";

    return (
        <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Invoice?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete the invoice for{" "}
                        <span className="font-semibold text-foreground">
                            {periodLabel}
                        </span>
                        ? This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
