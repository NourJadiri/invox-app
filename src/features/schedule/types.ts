import type { Student } from "@/features/students/types";

export type Lesson = {
  id: string;
  title: string | null;
  start: string; // ISO string from API
  end: string;   // ISO string from API
  notes: string | null;
  price: number | null;
  recurrent: boolean;
  color: string | null;
  recurringLessonId: string | null;
  studentId: string;
  student?: Student;
  createdAt: string;
  updatedAt: string;
};

export type LessonDraft = {
  title: string;
  start: Date;
  end: Date;
  notes: string;
  price: number | null;
  recurrent: boolean;
  studentId: string;
};

export const emptyLessonDraft: LessonDraft = {
  title: "",
  start: new Date(),
  end: new Date(new Date().setHours(new Date().getHours() + 1)),
  notes: "",
  price: null,
  recurrent: false,
  studentId: "",
};
