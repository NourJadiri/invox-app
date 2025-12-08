import { prisma } from "@/lib/prisma";

// ============================================================
// Inferred Prisma Types
// ============================================================

// Infer types from Prisma client
type PrismaInvoice = NonNullable<
  Awaited<ReturnType<typeof prisma.invoice.findUnique>>
>;
type PrismaStudent = NonNullable<
  Awaited<ReturnType<typeof prisma.student.findUnique>>
>;

export type InvoiceWithStudents = PrismaInvoice & { students: PrismaStudent[] };

// ============================================================
// Input Types
// ============================================================

export interface CreateInvoiceInput {
  startDate: string | Date;
  endDate: string | Date;
  studentIds: string[];
  total?: number;
}
