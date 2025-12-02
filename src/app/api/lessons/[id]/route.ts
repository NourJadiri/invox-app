import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { title, start, end, notes, studentId, price, recurrent } = body;

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
      },
      include: {
        student: true,
      },
    });

    return NextResponse.json(lesson);
  } catch (error) {
    console.error("Failed to update lesson:", error);
    return NextResponse.json(
      { error: "Failed to update lesson" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.lesson.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete lesson:", error);
    return NextResponse.json(
      { error: "Failed to delete lesson" },
      { status: 500 }
    );
  }
}
