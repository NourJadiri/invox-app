"use server";

import { createInvoice, type CreateInvoiceInput } from "@/services";
import { revalidatePath } from "next/cache";

export interface CreateInvoiceActionInput {
  startDate: string;
  endDate: string;
  studentIds: string[];
  total: number;
}

export async function createInvoiceAction(
  data: CreateInvoiceActionInput,
): Promise<{ success: boolean; error?: string }> {
  try {
    const payload: CreateInvoiceInput = {
      startDate: data.startDate,
      endDate: data.endDate,
      studentIds: data.studentIds,
      total: data.total,
    };

    await createInvoice(payload);

    // Ensure invoice list page shows the new record on next load
    revalidatePath("/invoice");

    return { success: true };
  } catch (error) {
    console.error("Failed to create invoice record:", error);
    return {
      success: false,
      error: "Failed to save invoice record. Please try again later.",
    };
  }
}
