import type { InvoiceConfig } from "@/features/invoice/types";

function getLessonDurationHours(lesson: InvoiceConfig["lessons"][0]): number {
  const startTime = new Date(lesson.start).getTime();
  const endTime = new Date(lesson.end).getTime();
  const durationMs = endTime - startTime;
  const durationHours = durationMs / (1000 * 60 * 60);
  return durationHours > 0 ? durationHours : 0;
}

function getLessonHourlyRate(lesson: InvoiceConfig["lessons"][0]): number {
  return lesson.price ?? 0;
}

function getLessonTotal(lesson: InvoiceConfig["lessons"][0]): number {
  const hours = getLessonDurationHours(lesson);
  const rate = getLessonHourlyRate(lesson);
  return hours * rate;
}

/**
 * Computes the grand total for an invoice configuration.
 * Only counts lessons for selected students.
 */
export function computeInvoiceTotal(config: InvoiceConfig): number {
  return config.lessons
    .filter((lesson) => config.selectedStudentIds.includes(lesson.studentId))
    .reduce((sum, lesson) => sum + getLessonTotal(lesson), 0);
}
