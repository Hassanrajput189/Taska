import { NextResponse } from "next/server";
import { task_info } from "@/interfaces";
import { prisma } from "@/lib/db";
import { authenticateToken, requireAdmin } from "@/lib/middleware/auth";

export async function POST(request: Request) {
  try {
    // Authenticate user
    const authResult = await authenticateToken(request);
    if (authResult.error) {
      return NextResponse.json(
        { message: authResult.error, status: authResult.status },
        { status: authResult.status }
      );
    }

    // Verify admin role
    const adminCheck = requireAdmin(authResult.user!);
    if (adminCheck.error) {
      return NextResponse.json(
        { message: adminCheck.error, status: adminCheck.status },
        { status: adminCheck.status }
      );
    }

    const req_data: task_info = await request.json();
    console.log(req_data);

    const existing = await prisma.task.findFirst({
      where: {
        title: req_data.title,
        assign: req_data.assign,
      },
    });

    if (existing) {
      return NextResponse.json({
        message: "cannot create task with same title",
        status: 409,
      });
    }

    await prisma.task.create({
      data: {
        title: req_data.title!,
        due_date: new Date(req_data.due_date!),
        priority: req_data.priority!,
        status: req_data.status!,
        assign: req_data.assign!,
        desc: req_data.desc!,
        admin_email: req_data.email!,
      },
    });

    return NextResponse.json({
      message: "task created successfully!",
      status: 201,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({
      message: "Something went wrong",
      status: 500,
    });
  }
}
