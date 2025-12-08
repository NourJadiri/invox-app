"use client";

import { format } from "date-fns";
import { fr } from "date-fns/locale/fr";
import type { InvoiceWithStudents } from "@/services/types/invoices";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface InvoiceListProps {
  invoices: InvoiceWithStudents[];
  onSelect: (invoice: InvoiceWithStudents) => void;
}

export function InvoiceList({ invoices, onSelect }: InvoiceListProps) {
  if (invoices.length === 0) {
    return null;
  }

  return (
    <Card className="mt-8">
      <div className="border-b px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Recent invoices</h2>
          <p className="text-xs text-muted-foreground">
            Click an invoice to regenerate it for the same period and students.
          </p>
        </div>
      </div>
      <div className="px-4 py-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-40">Created at</TableHead>
              <TableHead className="w-40">Period</TableHead>
              <TableHead>Students</TableHead>
              <TableHead className="text-right w-28">Total</TableHead>
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
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
