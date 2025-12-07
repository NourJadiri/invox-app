"use client";

import { useState } from "react";
import { InvoiceHeader } from "@/features/invoice/components/invoice-header";
import { InvoiceFormDialog } from "@/features/invoice/components/invoice-form-dialog";
import { InvoicePreview } from "@/features/invoice/components/invoice-preview";
import type { InvoiceConfig } from "@/features/invoice/types";

export default function InvoiceManager() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [invoiceConfig, setInvoiceConfig] = useState<InvoiceConfig | null>(null);

  function handleNewInvoice() {
    setIsDialogOpen(true);
  }

  function handleInvoiceGenerated(config: InvoiceConfig) {
    setInvoiceConfig(config);
    setIsDialogOpen(false);
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <InvoiceHeader onNewInvoice={handleNewInvoice} />

      <InvoiceFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onInvoiceGenerated={handleInvoiceGenerated}
      />

      {invoiceConfig && (
        <div className="mt-8">
          <InvoicePreview config={invoiceConfig} />
        </div>
      )}
    </div>
  );
}
