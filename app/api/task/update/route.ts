import { NextResponse } from "next/server";
import { task_info } from "@/interfaces";
import { prisma } from "@/lib/db";
import { authenticateToken } from "@/lib/middleware/auth";
import { exit } from "process";

export async function PATCH(request: Request) {
  let req_data: task_info = {};
  // Prepare update data - only update provided fields
  let updateData: any = {};
  try {
    // Authenticate user
    const authResult = await authenticateToken(request);
    if (authResult.error) {
      return NextResponse.json(
        { message: authResult.error, status: authResult.status },
        { status: authResult.status },
      );
    }

    req_data = await request.json();

    // Validate required fields
    if (!req_data.title || !req_data.assign) {
      return NextResponse.json(
        { message: "Title and assign fields are required", status: 400 },
        { status: 400 },
      );
    }

    // Check if user is admin
    const isAdmin =
      authResult.user!.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

    // If not admin, verify user owns the task they're updating
    if (!isAdmin && authResult.user!.email !== req_data.assign) {
      return NextResponse.json(
        { message: "You can only update your own tasks", status: 403 },
        { status: 403 },
      );
    }

    if (req_data.due_date !== undefined) {
      // Convert string date to Date object if it's a string
      updateData.due_date =
        typeof req_data.due_date === "string"
          ? new Date(req_data.due_date)
          : req_data.due_date;
    }
    if (req_data.priority !== undefined)
      updateData.priority = req_data.priority;
    if (req_data.status !== undefined) updateData.status = req_data.status;
    if (req_data.desc !== undefined) updateData.desc = req_data.desc;

    // Admin can change assignee, regular user cannot
    if (isAdmin) {
      updateData.assign = req_data.assign;
    } else {
      // For regular users, always use their authenticated email
      updateData.assign = authResult.user!.email;
    }

    const existing = await prisma.task.findFirst({
      where: {
        title: req_data.title,
        assign: req_data.assign,
      },
    });

    if (existing) {
      const isSame =
        (updateData.priority === undefined ||
          updateData.priority === existing.priority) &&
        (updateData.status === undefined ||
          updateData.status === existing.status) &&
        (updateData.desc === undefined || updateData.desc === existing.desc) &&
        (updateData.due_date === undefined ||
          new Date(updateData.due_date).getTime() ===
            new Date(existing.due_date).getTime());
      if (isSame) {
        return NextResponse.json({
          message: "cannot update with the same values",
          status: 409,
        });
      }
      const updatedTask = await prisma.task.update({
        where: {
          title_assign: {
            title: req_data.title,
            assign: req_data.assign,
          },
        },
        data: updateData,
      });

      return NextResponse.json({
        message: "Task updated successfully!",
        status: 200,
        task: updatedTask,
      });
    } else {
      const createdTask = await prisma.task.create({
        data: {
          title: req_data.title!,
          ...updateData,
          admin_email: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
        },
      });

      return NextResponse.json({
        message: "Task did not exist, so it was created successfully!",
        status: 201,
        task: createdTask,
      });
    }
  } catch (error: any) {
    console.error("Update task error:", error);

    return NextResponse.json({
      message: "Failed to update task",
      status: 500,
      error: error.message,
    });
  }
}
