// Re-export Student type from service layer to ensure consistency
export type { Student } from "@/services/types/students";


export type StudentDraft = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes: string;
  defaultLessonPrice: number | null;
};

export const emptyStudentDraft: StudentDraft = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  notes: "",
  defaultLessonPrice: null,
};

export type StudentFormValues = StudentDraft;

export const emptyStudentForm = emptyStudentDraft;
