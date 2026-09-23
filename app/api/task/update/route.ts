import { NextResponse } from "next/server";
import { task_info } from "@/interfaces";
import { prisma } from "@/lib/db";

export async function PATCH(request: Request) {
  let updateData: any = {};
  try {
    let req_data = await request.json();

    const {
      title,
      due_date,
      priority,
      status,
      assign,
      desc,
      admin_email,
    } = req_data as task_info;

    if (!title || !assign) {
      return NextResponse.json(
        { message: "Title and assign fields are required", status: 400 },
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

    const existing = await prisma.task.findUnique({
      where: {
        title_assign: {
          title,
          assign,
        },
      },
    });

    if (existing) {
      const updatedTask = await prisma.task.update({
        where: {
          title_assign: {
            title,
            assign,
          },
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
        admin_email: admin_email!,
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