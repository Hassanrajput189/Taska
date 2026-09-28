import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
export async function PATCH(request: Request) {
  try {
    const req_data = await request.json();
    const { title, assign, newAssign,admin_email } = req_data as {
      title?: string; assign?: string; newAssign?: string; admin_email:string;
    };

    if (!title || !newAssign ) {
      return NextResponse.json({ message: "Title and assignee are required", status: 400 }, { status: 400 });
    }
    if(!admin_email){
        return NextResponse.json({ message: "Unable to locate the values to update", status: 400 }, { status: 400 });
    }

    const currentAssign = assign ?? "";
    const existingTask = await prisma.task.findUnique({ where: { title_assign_admin_email: { title, assign: currentAssign,admin_email } } });
    if (!existingTask) return NextResponse.json({ message: "Task not found", status: 404 }, { status: 404 });

    const conflict = await prisma.task.findUnique({ where: { title_assign_admin_email: { title, assign: newAssign,admin_email } } });
    if (conflict) return NextResponse.json({ message: "This task is already assigned to that user", status: 409 }, { status: 409 });

    const updatedTask = await prisma.task.update({
      where: { title_assign_admin_email: { title, assign: currentAssign,admin_email } },
      data: { assign: newAssign },
    });

    return NextResponse.json({ message: "Task assigned successfully!", status: 200, task: updatedTask });
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to assign task", status: 500, error: error.message }, { status: 500 });
  }
}