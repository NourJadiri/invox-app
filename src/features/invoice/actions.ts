"use server";

import { createInvoice, deleteInvoice, type CreateInvoiceInput } from "@/services";
import type { InvoiceWithStudents } from "@/services/types/invoices";
import { revalidatePath } from "next/cache";

export interface CreateInvoiceActionInput {
  startDate: string;
  endDate: string;
  studentIds: string[];
  total: number;
}

export interface CreateInvoiceActionResult {
  success: boolean;
  error?: string;
  invoice?: InvoiceWithStudents;
}

export async function createInvoiceAction(
  data: CreateInvoiceActionInput,
): Promise<CreateInvoiceActionResult> {
  try {
    const payload: CreateInvoiceInput = {
      startDate: data.startDate,
      endDate: data.endDate,
      studentIds: data.studentIds,
      total: data.total,
    };

    const invoice = await createInvoice(payload);

    // Ensure invoice list page shows the new record on next load
    revalidatePath("/invoice");

    return { success: true, invoice };
  } catch (error) {
    console.error("Failed to create invoice record:", error);
    return {
      success: false,
      error: "Failed to save invoice record. Please try again later.",
    };
  }
}

export async function deleteInvoiceAction(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    await deleteInvoice(id);

    // Revalidate the invoice page to reflect the deletion
    revalidatePath("/invoice");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete invoice:", error);
    return {
      success: false,
      error: "Failed to delete invoice. Please try again later.",
    };
  }
}
