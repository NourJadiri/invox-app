import InvoiceManager from "@/features/invoice/components/invoice-manager";
import { getInvoices } from "@/services/invoices";

export default async function InvoicePage() {
    const invoices = await getInvoices();
    return <InvoiceManager initialInvoices={invoices} />;
}
