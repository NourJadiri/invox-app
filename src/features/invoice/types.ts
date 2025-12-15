import type { Lesson } from "@/features/schedule/types";
import type { Student } from "@/features/students/types";

export type InvoiceLesson = Lesson;
export type InvoiceStudent = Student;

export interface InvoiceConfig {
  startDate: string; // ISO date string (yyyy-MM-dd)
  endDate: string;   // ISO date string (yyyy-MM-dd)
  lessons: InvoiceLesson[];
  students: InvoiceStudent[];
  selectedStudentIds: string[];
  number?: number;
  date?: string;
}
