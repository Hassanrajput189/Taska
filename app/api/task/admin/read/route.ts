import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { user_data } from "@/interfaces";

export async function POST(request: Request) {
  try {
    const req_data = await request.json();

    const tasks = await prisma.task.findMany({
      where: {
        admin_email: req_data.email,
        assign: {
          not: req_data.email,
        },
      },
    });
    



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
