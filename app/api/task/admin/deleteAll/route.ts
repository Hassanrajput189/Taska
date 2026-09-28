
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
export async function DELETE(request: Request) {
  try {
    const req_data = await request.json();

    const { assign, admin_email } = req_data as {
      assign?: string;
      admin_email?: string;
    };

    if (!assign) {
      return NextResponse.json(
        { message: "Assignee email is required", status: 400 },
        { status: 400 },
      );
    }

    const result = await prisma.task.deleteMany({
      where: {
        assign,
        ...(admin_email ? { admin_email } : {}),
      },
    });

    return NextResponse.json({
      message: `${result.count} task(s) deleted successfully!`,
      status: 200,
      count: result.count,
    });
  } catch (error: any) {
    console.error("Delete all tasks error:", error);
    return NextResponse.json(
      { message: "Failed to delete tasks", status: 500, error: error.message },
      { status: 500 },
    );
  }
}