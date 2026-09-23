import { NextResponse } from "next/server";
import { task_info } from "@/interfaces";
import { prisma } from "@/lib/db";


export async function DELETE(request: Request) {
  try {
    const req_data: task_info = await request.json();

    // Validate required fields
    if (!req_data.title || !req_data.assign) {
      return NextResponse.json(
        {
          message: "Title and assign fields are required",
          status: 400,
        },
        { status: 400 }
      );
    }

    

    // Attempt to delete the task
    await prisma.task.delete({
      where: {
        title_assign: {
          title: req_data.title,
          assign: req_data.assign,
        },
      },
    });

    return NextResponse.json(
      {
        message: "Task deleted successfully!",
        status: 200,
      },
      
    );
  } catch (error: any) {
    console.error("Delete task error:", error);

    // Handle specific Prisma errors
    if (error.code === "P2025") {
      return NextResponse.json(
        {
          message: "Task not found",
          status: 404,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Failed to delete task",
        status: 500,
        error: error.message,
      },
      
    );
  }
}
