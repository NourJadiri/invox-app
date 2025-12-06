import type { LessonWithStudent } from "@/services/types/lessons";

// Use the Prisma type for lessons throughout the app
export type Lesson = LessonWithStudent;

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
