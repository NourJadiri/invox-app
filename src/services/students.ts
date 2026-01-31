import { prisma } from "@/lib/prisma";
import type {
  Student,
  CreateStudentInput,
  UpdateStudentInput,
} from "./types/students";

// ============================================================
// Student Service Functions
// ============================================================

/**
 * Retrieves all students ordered by creation date (newest first).
 */
export async function getStudents(): Promise<Student[]> {
  const students = await prisma.student.findMany({
    orderBy: { createdAt: "desc" },
  });

  return students;
}

/**
 * Retrieves a single student by ID.
 */
export async function getStudentById(id: string): Promise<Student | null> {
  const student = await prisma.student.findUnique({
    where: { id },
  });

  return student;
}

/**
 * Creates a new student.
 */
export async function createStudent(input: CreateStudentInput): Promise<Student> {
  const { firstName, lastName, email, phone, notes, defaultLessonPrice } = input;

  const student = await prisma.student.create({
    data: {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email?.trim() || null,
      phone: phone?.trim() || null,
      notes: notes?.trim() || null,
      defaultLessonPrice: defaultLessonPrice ?? null,
    },
  });

  return student;
}

/**
 * Updates an existing student.
 */
export async function updateStudent(
  id: string,
  input: UpdateStudentInput
): Promise<Student> {
  const { firstName, lastName, email, phone, notes, defaultLessonPrice } = input;

  const student = await prisma.student.update({
    where: { id },
    data: {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email?.trim() || null,
      phone: phone?.trim() || null,
      notes: notes?.trim() || null,
      defaultLessonPrice: defaultLessonPrice ?? null,
    },
  });

  return student;
}

/**
 * Deletes a student by ID.
 */
export async function deleteStudent(id: string): Promise<void> {
  await prisma.student.delete({ where: { id } });
}

/**
 * Searches students by name (first or last name).
 */
export async function searchStudents(query: string): Promise<Student[]> {
  const students = await prisma.student.findMany({
    where: {
      OR: [
        { firstName: { contains: query } },
        { lastName: { contains: query } },
      ],
    },
    orderBy: { createdAt: "desc" },
  });

  return students;
}

/**
 * Retrieves a student with all their lessons.
 */
export async function getStudentWithLessons(id: string) {
  const student = await prisma.student.findUnique({
    where: { id },
    include: {
      lessons: {
        orderBy: { start: "desc" },
      },
    },
  });

  return student;
}
