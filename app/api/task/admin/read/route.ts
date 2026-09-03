import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { user_data } from "@/interfaces";
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

    const body = await request.json();

    const assignees: user_data[] = body.assignees;

    if (!Array.isArray(assignees) || assignees.length === 0) {
      return NextResponse.json({
        status: 400,
        message: "No assignees provided",
        tasks: [],
      });
    }

    // Extract emails from assignees and filter out admin email
    const emails = assignees
      .map((user) => user.email)
      .filter((email): email is string => Boolean(email))
      .filter((email) => email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL);

    if (emails.length === 0) {
      return NextResponse.json({
        status: 404,
        message: "No valid assignee emails found",
        tasks: [],
      });
    }

    // Fetch all tasks belonging to those users (excluding admin)
    const tasks = await prisma.task.findMany({
      where: {
        assign: {
          in: emails,
        },
      },
    });

    if (tasks.length === 0) {
      return NextResponse.json({
        status: 404,
        message: "No tasks found",
        tasks: [],
      });
    }

    return NextResponse.json({
      status: 200,
      message: "Tasks fetched successfully",
      tasks,
    });
  } catch (error) {
    console.error("Admin task fetch error:", error);

    return NextResponse.json({
      status: 500,
      message: "Something went wrong",
      tasks: [],
    });
  }
}
