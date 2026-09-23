import { NextResponse } from "next/server";
import { admin_data } from "@/interfaces";
import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    return NextResponse.json({
      message: "Server configuration error",
      status: 500,
    });
  }

  try {
    const req_data: admin_data = await request.json();

    const admin = await prisma.admin.findUnique({
      where: {
        email: req_data.email,
      },
    });

    if (!admin) {
      return NextResponse.json({
        message: "Entered Email is invalid",
        status: 401,
      });
    }

    const isMatched = await bcrypt.compare(req_data.password!, admin.password!);

    if (!isMatched) {
      return NextResponse.json({
        message: "Entered Password is invalid",
        status: 401,
      });
    }    
    

    const response = NextResponse.json({
      message: "Login successful",
      status: 200,
      data: {
        f_name: admin.f_name,
        email: admin.email,
      },
    });

    const cookieStore = await cookies();
    const prevToken = cookieStore.get("token");
    if (prevToken) {
      response.cookies.delete(prevToken);
    }

    const newToken = jwt.sign(
      {
        email: req_data.email,
        role: admin.role,
      },
      JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    response.cookies.set("token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error) {
    console.error(error);

    return NextResponse.json({ message: "Something went wrong", status: 500 });
  }
}
