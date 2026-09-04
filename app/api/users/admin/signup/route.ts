import { NextResponse } from "next/server";
import { user_data } from "@/interfaces";
import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";
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

    const req_data: user_data = await request.json();

    const existing = await prisma.user.findUnique({
      where: {
        email: req_data.email,
      },
    });

    if (existing) {
      return NextResponse.json({ message: "User already exists", status: 409 });
    }

    const hashedPassword = await bcrypt.hash(req_data.password!, 10);

    await prisma.user.create({
      data: {
        email: req_data.email!,
        f_name: req_data.f_name,
        role: req_data.role,
        password: hashedPassword,
      },
    });

    return NextResponse.json({
      message: "Signup successful",
      status: 201,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ message: "Something went wrong", status: 500 });
  }
}
