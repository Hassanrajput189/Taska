import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { admin_data } from "@/interfaces";

export async function POST(request: Request) {
  try {
    const req_data: admin_data = await request.json();

    const assignees = await prisma.user.findMany({
      where: {
        admin_email: req_data.email,
        is_active: true,
      },
      select: {        
        email: true,                
      },
    });
    console.log("Assignees:", assignees);

    

    return NextResponse.json({
      status: 200,
      data: assignees,
    });
  } catch (error) {
    console.error("ASSIGNEE API ERROR:", error);

    return NextResponse.json(
      {
        message: "Something went wrong",
        error: error instanceof Error ? error.message : String(error),
      },
      {
        status: 500,
      },
    );
  }
}
