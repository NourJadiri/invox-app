import { prisma } from "@/lib/prisma";

// ============================================================
// Inferred Prisma Types
// ============================================================

// Infer type from Prisma client
type PrismaStudent = NonNullable<
  Awaited<ReturnType<typeof prisma.student.findUnique>>
>;

export type Student = PrismaStudent;

// ============================================================
// Input Types
// ============================================================

export interface CreateStudentInput {
  firstName: string;
  lastName: string;
  email?: string | null;
  phone?: string | null;
  notes?: string | null;
}

export interface UpdateStudentInput {
  firstName: string;
  lastName: string;
  email?: string | null;
  phone?: string | null;
  notes?: string | null;
}
