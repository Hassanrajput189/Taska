import { NextResponse } from "next/server";
import { task_info } from "@/interfaces";
import { prisma } from "@/lib/db";

export async function DELETE(request: Request) {
  try {
    const req_data: task_info = await request.json();
    
    // Validate required fields
    if (!req_data.title || typeof req_data.assign !== "string") {
      return NextResponse.json(
        { message: "Title and assign fields are required", status: 400 },
        { status: 400 },
      );
    }

    // Attempt to delete the task
    await prisma.task.delete({
      where: {
        title_assign_admin_email: {
          title: req_data.title,
          assign: req_data.assign,
          admin_email: req_data.admin_email!,
        },
      },
    });

    return NextResponse.json({
      message: "Task deleted successfully!",
      status: 200,
    });
  } catch (error: any) {
    console.error("Delete task error:", error);

    // Handle specific Prisma errors
    if (error.code === "P2025") {
      return NextResponse.json(
        {
          message: "Task not found",
          status: 404,
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Failed to delete task",
      status: 500,
      error: error.message,
    });
  }
}
