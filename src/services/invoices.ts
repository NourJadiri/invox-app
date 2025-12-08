import { prisma } from "@/lib/prisma";
import type { CreateInvoiceInput, InvoiceWithStudents } from "./types/invoices";

// ============================================================
// Invoice Service Functions
// ============================================================

export async function createInvoice(input: CreateInvoiceInput): Promise<InvoiceWithStudents> {
  const { startDate, endDate, studentIds, total = 0 } = input;

  const invoice = await prisma.invoice.create({
    data: {
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      total,
      students: {
        connect: studentIds.map((id) => ({ id })),
      },
    },
    include: {
      students: true,
    },
  });

  return invoice;
}

export async function getInvoices(): Promise<InvoiceWithStudents[]> {
  const invoices = await prisma.invoice.findMany({
    include: {
      students: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return invoices;
}

export async function getInvoiceById(id: string): Promise<InvoiceWithStudents | null> {
  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: {
      students: true,
    },
  });

  return invoice;
}

export async function deleteInvoice(id: string): Promise<void> {
  await prisma.invoice.delete({
    where: { id },
  });
}
