import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { updateGoogleEvent, deleteGoogleEvent } from "@/lib/google-calendar";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { title, start, end, notes, studentId, price, recurrent, color } = body;

    // Get existing lesson to check for googleEventId
    const existingLesson = await prisma.lesson.findUnique({
      where: { id },
    });

    if (existingLesson?.googleEventId && session?.user?.id) {
      try {
        const googleEvent: any = {
          summary: title,
          description: notes,
          start: start ? { dateTime: new Date(start).toISOString() } : undefined,
          end: end ? { dateTime: new Date(end).toISOString() } : undefined,
          colorId: "11", // Default to red
        };
        await updateGoogleEvent(session.user.id, existingLesson.googleEventId, googleEvent);
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
    const session = await getServerSession(authOptions);
    
    // Get existing lesson to check for googleEventId
    const existingLesson = await prisma.lesson.findUnique({
      where: { id },
    });

    if (existingLesson?.googleEventId && session?.user?.id) {
      try {
        await deleteGoogleEvent(session.user.id, existingLesson.googleEventId);
      } catch (error) {
         console.error("Failed to sync delete with Google Calendar:", error);
      }
    }

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
