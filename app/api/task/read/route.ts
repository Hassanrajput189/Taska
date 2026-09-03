import { NextResponse } from "next/server";
import { task_info } from "@/interfaces";
import { prisma } from "@/lib/db";
import { authenticateToken, verifyTaskOwnership } from "@/lib/middleware/auth";

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

    const req_data: task_info = await request.json();

    // Verify user can only read their own tasks
    const ownershipCheck = verifyTaskOwnership(
      authResult.user!,
      req_data.assign!
    );
    if (ownershipCheck.error) {
      return NextResponse.json(
        { message: ownershipCheck.error, status: ownershipCheck.status },
        { status: ownershipCheck.status }
      );
    }

    // Use authenticated email instead of request body
    const tasks = await prisma.task.findMany({
      where: {
        assign: authResult.user!.email,
      },
    });

    return NextResponse.json({
      status: 200,
      tasks: tasks,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({
      message: "Something went wrong",
      status: 500,
    });
  }
}
