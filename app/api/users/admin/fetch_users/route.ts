import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { admin_data } from "@/interfaces";

export async function POST(request: Request) {
  try {
    const req_data: admin_data = await request.json();

    console.log("User request:", req_data);

    const users = await prisma.user.findMany({
      where: {
        admin_email: req_data.email,        
      },
      select: {
        f_name: true,
        email: true,
        role: true,
        is_active: true,
      },
    });
    
    
    return NextResponse.json({
      status: 200,
      data: users,
    });
  } catch (error) {
    console.error("USER API ERROR:", error);

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
