import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  try {
    const where: any = {};
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
    const { title, start, end, notes, studentId } = body;

    if (!start || !end || !studentId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const lesson = await prisma.lesson.create({
      data: {
        title,
        start: new Date(start),
        end: new Date(end),
        notes,
        studentId,
      },
      include: {
        student: true,
      },
    });

    return NextResponse.json(lesson, { status: 201 });
  } catch (error) {
    console.error("Failed to create lesson:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create lesson" },
      { status: 500 }
    );
  }
}
