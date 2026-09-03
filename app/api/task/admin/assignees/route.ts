import { NextResponse } from "next/server";
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

    const users = await prisma.user.findMany({
      where: {
        email: {
          not: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
        },
      },
      select: {
        f_name: true,
        email: true,
        role: true,
      },
    });

    if (users.length === 0) {
      return NextResponse.json({
        status: 404,
      });
    }

    return NextResponse.json({
      status: 200,
      data: users,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Something went wrong", status: 500 });
  }
}
