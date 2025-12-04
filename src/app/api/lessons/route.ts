import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { insertGoogleEvent } from "@/lib/google-calendar";
import { calendar_v3 } from "googleapis";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  try {
    const where: { start?: { gte: Date; lte: Date } } = {};
    if (start && end) {
      where.start = {
        gte: new Date(start),
        lte: new Date(end),
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

    return NextResponse.json(lessons);
  } catch (error) {
    console.error("Failed to fetch lessons:", error);
    return NextResponse.json(
      { error: "Failed to fetch lessons" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { title, start, end, notes, studentId, price, recurrent, color } = body;

    if (!start || !end || !studentId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let googleEventId: string | undefined;

    // Sync with Google Calendar if user is authenticated
    if (session?.user?.id) {
      try {
        const googleEvent: calendar_v3.Schema$Event = {
          summary: title || "Lesson",
          description: notes,
          start: { dateTime: new Date(start).toISOString(), timeZone: "Europe/Paris" },
          end: { dateTime: new Date(end).toISOString(), timeZone: "Europe/Paris" },
          colorId: "11", // Default to red or map 'color' to Google colorId
        };

        if (recurrent) {
             googleEvent.recurrence = ['RRULE:FREQ=WEEKLY;COUNT=13'];
        }

        const createdEvent = await insertGoogleEvent(session.user.id, googleEvent);
        googleEventId = createdEvent.id || undefined;
      } catch (error) {
        console.error("Failed to sync with Google Calendar:", error);
        // Continue creating local lesson even if sync fails
      }
    }

    // If it's a recurring lesson, create the template and instances
    if (recurrent) {
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
          googleEventId, // Store the recurring event ID here
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
        const instanceStart = new Date(startDate.getTime() + i * 7 * 24 * 60 * 60 * 1000);
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
          // We don't store googleEventId for instances because they are part of the recurring event series
        });
      }

      // Create all instances
      await prisma.lesson.createMany({
        data: instances,
      });

      return NextResponse.json(templateLesson, { status: 201 });
    } else {
      // Create a single lesson
      const lesson = await prisma.lesson.create({
        data: {
          title,
          start: new Date(start),
          end: new Date(end),
          notes,
          price,
          recurrent: false,
          color,
          studentId,
          googleEventId,
        },
        include: {
          student: true,
        },
      });

      return NextResponse.json(lesson, { status: 201 });
    }
  } catch (error) {
    console.error("Failed to create lesson:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create lesson" },
      { status: 500 }
    );
  }
}
