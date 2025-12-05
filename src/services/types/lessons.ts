import { prisma } from "@/lib/prisma";

// ============================================================
// Inferred Prisma Types
// ============================================================

// Infer types from Prisma client
type PrismaLesson = NonNullable<
  Awaited<ReturnType<typeof prisma.lesson.findUnique>>
>;
type PrismaStudent = NonNullable<
  Awaited<ReturnType<typeof prisma.student.findUnique>>
>;

export type LessonWithStudent = PrismaLesson & { student: PrismaStudent };

// ============================================================
// Input Types
// ============================================================

export interface CreateLessonInput {
  title?: string;
  start: string | Date;
  end: string | Date;
  notes?: string;
  studentId: string;
  price?: number;
  recurrent?: boolean;
  color?: string;
}

export interface UpdateLessonInput {
  title?: string;
  start?: string | Date;
  end?: string | Date;
  notes?: string;
  studentId?: string;
  price?: number;
  recurrent?: boolean;
  color?: string;
}

export interface GetLessonsFilter {
  start?: string | Date;
  end?: string | Date;
}
