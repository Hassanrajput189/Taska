import { NextResponse } from "next/server";
import { task_info } from "@/interfaces";
import { prisma } from "@/lib/db";
import { authenticateToken } from "@/lib/middleware/auth";

export async function PATCH(request: Request) {
  try {
    // Authenticate user
    const authResult = await authenticateToken(request);
    if (authResult.error) {
      return NextResponse.json(
        { message: authResult.error, status: authResult.status },
        { status: authResult.status }
      );
    }

    const req_data: task_info = await request.json();

    // Validate required fields
    if (!req_data.title || !req_data.assign) {
      return NextResponse.json(
        { message: "Title and assign fields are required", status: 400 },
        { status: 400 }
      );
    }

    // Check if user is admin
    const isAdmin = authResult.user!.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

    // If not admin, verify user owns the task they're updating
    if (!isAdmin && authResult.user!.email !== req_data.assign) {
      return NextResponse.json(
        { message: "You can only update your own tasks", status: 403 },
        { status: 403 }
      );
    }

    console.log(
      "Updating task - Title:",
      req_data.title,
      "User:",
      authResult.user!.email,
      "Assign:",
      req_data.assign,
      "IsAdmin:",
      isAdmin
    );

    // Prepare update data - only update provided fields
    const updateData: any = {};
    if (req_data.due_date !== undefined) {
      // Convert string date to Date object if it's a string
      updateData.due_date = typeof req_data.due_date === 'string' 
        ? new Date(req_data.due_date) 
        : req_data.due_date;
    }
    if (req_data.priority !== undefined) updateData.priority = req_data.priority;
    if (req_data.status !== undefined) updateData.status = req_data.status;
    if (req_data.desc !== undefined) updateData.desc = req_data.desc;
    
    // Admin can change assignee, regular user cannot
    if (isAdmin) {
      updateData.assign = req_data.assign;
    } else {
      // For regular users, always use their authenticated email
      updateData.assign = authResult.user!.email;
    }

    // Update the task using the original assign field for composite key lookup
    const updatedTask = await prisma.task.update({
      where: {
        title_assign: {
          title: req_data.title,
          assign: req_data.assign,
        },
      },
      data: updateData,
    });
    

    return NextResponse.json(
      {
        message: "Task updated successfully!",
        status: 200,
        task: updatedTask,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Update task error:", error);

    // Handle specific Prisma errors
    if (error.code === "P2025") {
      return NextResponse.json(
        {
          message: "Task not found or you don't have permission to update it",
          status: 404,
        },
        { status: 404 }
      );
    }

    if (error.code === "P2003") {
      return NextResponse.json(
        {
          message: "Invalid foreign key constraint",
          status: 400,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "Failed to update task",
        status: 500,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
