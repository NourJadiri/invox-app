import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
    const body = await request.json();
    const { title, start, end, notes, studentId, price, recurrent, color } = body;

    if (!start || !end || !studentId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
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
