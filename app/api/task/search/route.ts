import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { task_info } from "@/interfaces";

export async function POST(request: NextRequest) {
  try {
    const req_data: task_info = await request.json();
    const { searchParams } = new URL(request.url);

    const query = searchParams.get("query");

    if (!query || query.trim() === "") {
      return NextResponse.json({
        status: 400,
      });
    }

    const searchValue = query.trim();

    const tasks = await prisma.task.findMany({
      where: {
        assign: req_data.assign,
        OR: [
          { title: { contains: searchValue } },
          { priority: { contains: searchValue } },
          { status: { contains: searchValue } },
          { assign: { contains: searchValue } },
          { desc: { contains: searchValue } },
        ],
      },
    });

    if (tasks.length === 0) {
      return NextResponse.json({
        status: 404,
      });
    }

    return NextResponse.json({
      tasks: tasks,
      status: 200,
    });

  } catch (error) {
    console.error("Search error:", error);

    return NextResponse.json({
      message: "Internal server error",
      status: 500,
    });
  }
}
