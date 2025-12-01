import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const students = await prisma.student.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(students);
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as
    | {
        firstName?: string;
        lastName?: string;
        email?: string | null;
        phone?: string | null;
        notes?: string | null;
      }
    | null;

  if (!body?.firstName || !body?.lastName) {
    return NextResponse.json(
      { error: "firstName and lastName are required" },
      { status: 400 },
    );
  }

  try {
    const student = await prisma.student.create({
      data: {
        firstName: body.firstName.trim(),
        lastName: body.lastName.trim(),
        email: body.email?.trim() || null,
        phone: body.phone?.trim() || null,
        notes: body.notes?.trim() || null,
      },
    });
    return NextResponse.json(student, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to create student" },
      { status: 500 },
    );
  }
}