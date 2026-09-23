import { NextResponse } from "next/server";
import { task_info } from "@/interfaces";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const req_data: task_info = await request.json();

    // Use authenticated email instead of request body
    const tasks = await prisma.task.findMany({
      where: {
        assign: req_data.assign!,
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
