import { NextResponse } from "next/server";
import { task_info } from "@/interfaces";
import { prisma } from "@/lib/db";

export async function PATCH(request: Request) {
  const updateData: any = {};
  try {
    const body = await request.json();
    const req_data = body.updatedTask ?? body;

    const { title, due_date, priority, status, desc, admin_email } =
      req_data as task_info;
    const assign: string = req_data.assign ?? "";
    const prevAssign: string = req_data.prevAssign ?? "";

    if (!title) {
      return NextResponse.json(
        { message: "Title is required", status: 400 },
        { status: 400 },
      );
    }
    if (!admin_email) {
      return NextResponse.json(
        { message: "Unable to locate the value to update", status: 400 },
        { status: 400 },
      );
    }

    if (due_date !== undefined) {
      updateData.due_date =
        typeof due_date === "string" ? new Date(due_date) : due_date;
    }
    if (priority !== undefined) updateData.priority = priority;
    if (status !== undefined) updateData.status = status;
    if (desc !== undefined) updateData.desc = desc;
    updateData.assign = assign;

    // Assignee is being changed: make sure the target user doesn't already have this task
    if (assign !== prevAssign) {
      const duplicate = await prisma.task.findUnique({
        where: {
          title_assign_admin_email: { title, assign, admin_email },
        },
      });
      if (duplicate) {
        return NextResponse.json({
          message: "Same task already exists for this user",
          status: 409,
        });
      }
    }

    const existing = await prisma.task.findUnique({
      where: {
        title_assign_admin_email: { title, assign: prevAssign, admin_email },
      },
    });

    if (existing) {
      const updatedTask = await prisma.task.update({
        where: {
          title_assign_admin_email: { title, assign: prevAssign, admin_email },
        },
        data: updateData,
      });

      return NextResponse.json({
        message: "Task updated successfully!",
        status: 200,
        task: updatedTask,
      });
    }

    const createdTask = await prisma.task.create({
      data: {
        title,
        assign,
        due_date: updateData.due_date,
        priority: updateData.priority,
        status: updateData.status,
        desc: updateData.desc,
        admin_email,
      },
    });

    return NextResponse.json({
      message: "Task did not exist, so it was created successfully!",
      status: 201,
      task: createdTask,
    });
  } catch (error: any) {
    console.error("Update task error:", error);
    return NextResponse.json({
      message: "Failed to update task",
      status: 500,
      error: error.message,
    });
  }
}