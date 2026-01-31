import { prisma } from "@/lib/prisma";
import {
  insertGoogleEvent,
  updateGoogleEvent,
  deleteGoogleEvent,
  listGoogleCalendarEvents,
} from "@/lib/google-calendar";
import { calendar_v3 } from "googleapis";
import type {
  LessonWithStudent,
  CreateLessonInput,
  UpdateLessonInput,
  GetLessonsFilter,
} from "./types/lessons";

// ============================================================
// Lesson Service Functions
// ============================================================

/**
 * Retrieves lessons with optional date range filtering.
 */
export async function getLessons(
  filter?: GetLessonsFilter
): Promise<LessonWithStudent[]> {
  const where: { start?: { gte: Date; lte: Date } } = {};

  if (filter?.start && filter?.end) {
    where.start = {
      gte: new Date(filter.start),
      lte: new Date(filter.end),
    };
  }

  const lessons = await prisma.lesson.findMany({
    where,
    include: {
      student: true,
    },
    orderBy: {
      start: "asc",
    },
  });

  return lessons;
}

/**
 * Retrieves a single lesson by ID.
 */
export async function getLessonById(
  id: string
): Promise<LessonWithStudent | null> {
  const lesson = await prisma.lesson.findUnique({
    where: { id },
    include: {
      student: true,
    },
  });

  return lesson;
}

/**
 * Creates a new lesson. If recurrent, creates a template and 12 weekly instances.
 * Optionally syncs with Google Calendar if userId is provided.
 */
export async function createLesson(
  input: CreateLessonInput,
  userId?: string
): Promise<LessonWithStudent> {
  const { title, start, end, notes, studentId, price, recurrent, color } =
    input;

  let googleEventId: string | undefined;
  let studentDefaultPrice: number | null = null;

  // Fetch student to get default lesson price and name
  const student = await prisma.student.findUnique({
    where: { id: studentId },
  });

  if (student) {
    studentDefaultPrice = student.defaultLessonPrice ?? null;
  }

  // Use provided price or fall back to student's default price
  const effectivePrice = price ?? studentDefaultPrice ?? undefined;

  // Sync with Google Calendar if user is authenticated
  if (userId) {
    try {
      const studentName = student
        ? `${student.firstName} ${student.lastName}`.trim()
        : "Unknown Student";

      const googleEvent: calendar_v3.Schema$Event = {
        summary: `[CDP] ${studentName}`,
        description: title || undefined, // Lesson title as event notes
        start: {
          dateTime: new Date(start).toISOString(),
          timeZone: "Europe/Paris",
        },
        end: {
          dateTime: new Date(end).toISOString(),
          timeZone: "Europe/Paris",
        },
        colorId: "11", // Default to red or map 'color' to Google colorId
      };

      if (recurrent) {
        googleEvent.recurrence = ["RRULE:FREQ=WEEKLY;COUNT=13"];
      }

      const createdEvent = await insertGoogleEvent(userId, googleEvent);
      googleEventId = createdEvent.id || undefined;
    } catch (error) {
      console.error("Failed to sync with Google Calendar:", error);
      // Continue creating local lesson even if sync fails
    }
  }

  // If it's a recurring lesson, create the template and instances
  if (recurrent) {
    const templateLesson = await createRecurringLesson(
      { title, start, end, notes, studentId, price: effectivePrice, color },
      googleEventId
    );
    return templateLesson;
  }

  // Create a single lesson
  const lesson = await prisma.lesson.create({
    data: {
      title,
      start: new Date(start),
      end: new Date(end),
      notes,
      price: effectivePrice,
      recurrent: false,
      color,
      studentId,
      googleEventId,
    },
    include: {
      student: true,
    },
  });

  return lesson;
}

/**
 * Creates a recurring lesson template with 12 weekly instances.
 */
async function createRecurringLesson(
  input: Omit<CreateLessonInput, "recurrent">,
  googleEventId?: string
): Promise<LessonWithStudent> {
  const { title, start, end, notes, studentId, price, color } = input;

  // Create the template lesson
  const templateLesson = await prisma.lesson.create({
    data: {
      title,
      start: new Date(start),
      end: new Date(end),
      notes,
      price,
      recurrent: true,
      color,
      studentId,
      googleEventId,
    },
    include: {
      student: true,
    },
  });

  // Generate 12 weeks of instances
  const instances = [];
  const startDate = new Date(start);
  const endDate = new Date(end);
  const duration = endDate.getTime() - startDate.getTime();

  for (let i = 1; i <= 12; i++) {
    const instanceStart = new Date(
      startDate.getTime() + i * 7 * 24 * 60 * 60 * 1000
    );
    const instanceEnd = new Date(instanceStart.getTime() + duration);

    instances.push({
      title,
      start: instanceStart,
      end: instanceEnd,
      notes,
      price,
      recurrent: false,
      color,
      studentId,
      recurringLessonId: templateLesson.id,
    });
  }

  // Create all instances
  await prisma.lesson.createMany({
    data: instances,
  });

  return templateLesson;
}

/**
 * Updates an existing lesson.
 * Optionally syncs with Google Calendar if userId is provided.
 */
export async function updateLesson(
  id: string,
  input: UpdateLessonInput,
  userId?: string
): Promise<LessonWithStudent> {
  const { title, start, end, notes, studentId, price, recurrent, color } =
    input;

  // Get existing lesson to check for googleEventId
  const existingLesson = await prisma.lesson.findUnique({
    where: { id },
  });

  // Sync update with Google Calendar if applicable
  if (existingLesson?.googleEventId && userId) {
    try {
      // Fetch student name for Google Calendar event title
      const effectiveStudentId = studentId || existingLesson.studentId;
      const student = effectiveStudentId
        ? await prisma.student.findUnique({
            where: { id: effectiveStudentId },
          })
        : null;
      const studentName = student
        ? `${student.firstName} ${student.lastName}`.trim()
        : "Unknown Student";

      const googleEvent: Partial<calendar_v3.Schema$Event> = {
        summary: `[CDP] ${studentName}`,
        description: title || undefined, // Lesson title as event notes
        start: start
          ? { dateTime: new Date(start).toISOString() }
          : undefined,
        end: end ? { dateTime: new Date(end).toISOString() } : undefined,
        colorId: "11",
      };
      await updateGoogleEvent(userId, existingLesson.googleEventId, googleEvent);
    } catch (error) {
      console.error("Failed to sync update with Google Calendar:", error);
    }
  }

  const lesson = await prisma.lesson.update({
    where: { id },
    data: {
      title,
      start: start ? new Date(start) : undefined,
      end: end ? new Date(end) : undefined,
      notes,
      studentId,
      price,
      recurrent,
      color,
    },
    include: {
      student: true,
    },
  });

  return lesson;
}

/**
 * Deletes a lesson by ID.
 * Optionally syncs deletion with Google Calendar if userId is provided.
 */
export async function deleteLesson(
  id: string,
  userId?: string
): Promise<void> {
  // Get existing lesson to check for googleEventId
  const existingLesson = await prisma.lesson.findUnique({
    where: { id },
  });

  // Sync deletion with Google Calendar if applicable
  if (existingLesson?.googleEventId && userId) {
    try {
      await deleteGoogleEvent(userId, existingLesson.googleEventId);
    } catch (error) {
      console.error("Failed to sync delete with Google Calendar:", error);
    }
  }

  await prisma.lesson.delete({
    where: { id },
  });
}

/**
 * Retrieves all instances of a recurring lesson.
 */
export async function getRecurringLessonInstances(
  recurringLessonId: string
): Promise<LessonWithStudent[]> {
  const instances = await prisma.lesson.findMany({
    where: {
      recurringLessonId,
    },
    include: {
      student: true,
    },
    orderBy: {
      start: "asc",
    },
  });

  return instances;
}

/**
 * Syncs all lessons without googleEventId to Google Calendar.
 * Returns the number of lessons synced.
 */
export async function syncLessonsToGoogleCalendar(
  userId: string
): Promise<{ synced: number; failed: number }> {
  // Find all lessons that don't have a googleEventId yet
  const unsyncedLessons = await prisma.lesson.findMany({
    where: {
      googleEventId: null,
    },
    include: {
      student: true,
    },
  });

  let synced = 0;
  let failed = 0;

  for (const lesson of unsyncedLessons) {
    try {
      // Use student name for Google Calendar event title
      const studentName = lesson.student
        ? `${lesson.student.firstName} ${lesson.student.lastName}`.trim()
        : "Unknown Student";

      const googleEvent: calendar_v3.Schema$Event = {
        summary: `[CDP] ${studentName}`,
        description: lesson.title || undefined, // Lesson title as event notes
        start: {
          dateTime: new Date(lesson.start).toISOString(),
          timeZone: "Europe/Paris",
        },
        end: {
          dateTime: new Date(lesson.end).toISOString(),
          timeZone: "Europe/Paris",
        },
        colorId: "11",
      };

      const createdEvent = await insertGoogleEvent(userId, googleEvent);

      // Update the lesson with the googleEventId
      await prisma.lesson.update({
        where: { id: lesson.id },
        data: { googleEventId: createdEvent.id },
      });

      synced++;
    } catch (error) {
      console.error(`Failed to sync lesson ${lesson.id}:`, error);
      failed++;
    }
  }

  return { synced, failed };
}

/**
 * Imports lessons from Google Calendar.
 * Looks for events with titles starting with "[CDP]" followed by student name.
 * Creates students if they don't exist.
 * Skips events that are already imported (by googleEventId).
 */
export async function importLessonsFromGoogleCalendar(
  userId: string,
  options: {
    timeMin?: Date;
    timeMax?: Date;
  } = {}
): Promise<{ imported: number; skipped: number; studentsCreated: number; errors: string[] }> {
  const CDP_PREFIX = "[CDP] ";
  const errors: string[] = [];
  let imported = 0;
  let skipped = 0;
  let studentsCreated = 0;

  // Fetch events from Google Calendar with [CDP] prefix
  const events = await listGoogleCalendarEvents(userId, {
    timeMin: options.timeMin,
    timeMax: options.timeMax,
    summaryPrefix: CDP_PREFIX,
    maxResults: 500,
  });

  // Get all existing googleEventIds to avoid duplicates
  const existingLessons = await prisma.lesson.findMany({
    where: {
      googleEventId: { not: null },
    },
    select: { googleEventId: true },
  });
  const existingEventIds = new Set(existingLessons.map((l) => l.googleEventId));

  // Cache for students to avoid repeated lookups
  const studentCache = new Map<string, { id: string; defaultLessonPrice: number | null }>(); // normalized name -> student info

  // Preload existing students
  const allStudents = await prisma.student.findMany();
  for (const student of allStudents) {
    const normalizedName = `${student.firstName} ${student.lastName}`.toLowerCase().trim();
    studentCache.set(normalizedName, {
      id: student.id,
      defaultLessonPrice: student.defaultLessonPrice ?? null,
    });
  }

  for (const event of events) {
    try {
      // Skip if already imported
      if (event.id && existingEventIds.has(event.id)) {
        skipped++;
        continue;
      }

      // Parse student name from title
      const summary = event.summary ?? "";
      if (!summary.startsWith(CDP_PREFIX)) {
        continue;
      }

      const studentName = summary.slice(CDP_PREFIX.length).trim();
      if (!studentName) {
        errors.push(`Event "${event.id}" has no student name after [CDP] prefix`);
        continue;
      }

      // Parse start and end times
      const startDateTime = event.start?.dateTime || event.start?.date;
      const endDateTime = event.end?.dateTime || event.end?.date;

      if (!startDateTime || !endDateTime) {
        errors.push(`Event "${event.id}" is missing start or end time`);
        continue;
      }

      // Find or create student
      const normalizedStudentName = studentName.toLowerCase().trim();
      let studentInfo = studentCache.get(normalizedStudentName);

      if (!studentInfo) {
        // Split name into first and last name
        const nameParts = studentName.split(/\s+/);
        const firstName = nameParts[0] ?? studentName;
        const lastName = nameParts.slice(1).join(" ") || "";

        // Create the student
        const newStudent = await prisma.student.create({
          data: {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
          },
        });

        studentInfo = {
          id: newStudent.id,
          defaultLessonPrice: newStudent.defaultLessonPrice ?? null,
        };
        studentCache.set(normalizedStudentName, studentInfo);
        studentsCreated++;
      }

      // Create the lesson with student's default price
      await prisma.lesson.create({
        data: {
          title: event.description || null, // Use event description as lesson title
          start: new Date(startDateTime),
          end: new Date(endDateTime),
          studentId: studentInfo.id,
          price: studentInfo.defaultLessonPrice ?? null,
          googleEventId: event.id,
          recurrent: false,
        },
      });

      imported++;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      errors.push(`Failed to import event "${event.id}": ${errorMessage}`);
    }
  }

  return { imported, skipped, studentsCreated, errors };
}

/**
 * Applies default lesson prices to all lessons within a date range.
 * Only updates lessons where the student has a defaultLessonPrice set.
 * Returns the number of lessons updated.
 */
export async function applyDefaultPricesToLessons(
  startDate: Date,
  endDate: Date
): Promise<{ updated: number; errors: string[] }> {
  const errors: string[] = [];
  let updated = 0;

  try {
    // Find all lessons in the date range that don't have a price set
    // or where we want to apply the default price
    const lessons = await prisma.lesson.findMany({
      where: {
        start: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        student: true,
      },
    });

    // Filter lessons where the student has a default price
    const lessonsToUpdate = lessons.filter(
      (lesson) => lesson.student?.defaultLessonPrice !== null && lesson.student?.defaultLessonPrice !== undefined
    );

    // Update each lesson with the student's default price
    for (const lesson of lessonsToUpdate) {
      try {
        await prisma.lesson.update({
          where: { id: lesson.id },
          data: {
            price: lesson.student!.defaultLessonPrice,
          },
        });
        updated++;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        errors.push(`Failed to update lesson "${lesson.id}": ${errorMessage}`);
      }
    }

    return { updated, errors };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    errors.push(`Failed to fetch lessons: ${errorMessage}`);
    return { updated, errors };
  }
}
