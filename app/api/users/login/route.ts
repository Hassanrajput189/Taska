import { NextResponse } from "next/server";
import { user_data } from "@/interfaces";
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
    const req_data: user_data = await request.json();

    if (!req_data.email || !req_data.admin_email) {
      return NextResponse.json({
        message: "Email and organization are required",
        status: 400,
      });
    }

    const existing_user = await prisma.user.findUnique({
      where:{
        email_admin_email: {
          email: req_data.email,
          admin_email: req_data.admin_email,
        },
      }      
    });

    if (!existing_user) {
      return NextResponse.json({
        message: "Entered Email is invalid",
        status: 401,
      });
    }

    const isMatched = await bcrypt.compare(req_data.password!, existing_user.password!);

    if (!isMatched) {
      return NextResponse.json({
        message: "Entered Password is invalid",
        status: 401,
      });
    }    
    if(existing_user.is_active === false) {
      return NextResponse.json({
        message: "You account is temporarily disabled by the admin",
        status: 401,
      });
    }

    const response = NextResponse.json({
      message: "Login successful",
      status: 200,
      data: {
        f_name: existing_user.f_name,
        email: existing_user.email,
        admin_email: existing_user.admin_email,
      },
    });

    const cookieStore = await cookies();
    const prevToken = cookieStore.get("token");
    if (prevToken) {
      response.cookies.delete(prevToken);
    }

    const newToken = jwt.sign(
      {
        email: existing_user.email,
        admin_email: existing_user.admin_email,
        role: existing_user.role,
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
