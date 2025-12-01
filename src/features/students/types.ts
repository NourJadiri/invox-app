export type Student = {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type StudentDraft = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes: string;
};

export const emptyStudentDraft: StudentDraft = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  notes: "",
};

export type StudentFormValues = StudentDraft;

export const emptyStudentForm = emptyStudentDraft;
