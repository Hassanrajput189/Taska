import { NextResponse } from "next/server";
import { user_data } from "@/interfaces";
import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  try {
    
    const req_data:user_data= await request.json();    

    const existing_user = await prisma.user.findUnique({
      where: {
        email: req_data.email,
      },
    });

    if (existing_user) {
      return NextResponse.json({ message: "User already exists", status: 409 });
    }

    const existing_admin = await prisma.admin.findUnique({
      where: {
        email: req_data.email,
      },
    });
    
    if (existing_admin) {
      return NextResponse.json({ message: "Cannot create user with existing admin email", status: 409 });
    }
    const hashedPassword = await bcrypt.hash(req_data.password!, 10);

    await prisma.user.create({
      data: {        
        email: req_data.email!,
        f_name: req_data.f_name,
        role: req_data.role,
        password: hashedPassword,
        is_active: true,
        admin_email: req_data.admin_email,
      },
    });

    return NextResponse.json({
      message: "User created successfully",
      status: 201,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ message: "Something went wrong", status: 500 });
  }
}
