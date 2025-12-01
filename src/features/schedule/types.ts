import type { Student } from "@/features/students/types";

export type Lesson = {
  id: string;
  title: string | null;
  start: string; // ISO string from API
  end: string;   // ISO string from API
  notes: string | null;
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
  studentId: string;
};

export const emptyLessonDraft: LessonDraft = {
  title: "",
  start: new Date(),
  end: new Date(new Date().setHours(new Date().getHours() + 1)),
  notes: "",
  studentId: "",
};
