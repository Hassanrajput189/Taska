import { NextResponse } from "next/server";
import { admin_data } from "@/interfaces";
import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  try {
    
    const req_data= await request.json();
    const {f_name,email,password,role} :admin_data = req_data
    

    const existing = await prisma.admin.findUnique({
      where: {
        email: email,
      },
    });

    if (existing) {
      return NextResponse.json({ message: "User already exists", status: 409 });
    }

    const verification = await prisma.emailVerification.findUnique({
      where: {
        email: email,
      },
    });
    if (!verification) {
      return NextResponse.json({ message: "Invalid OTP", status: 400 });
    }
    

    const isOTPValid =
      await bcrypt.compare(req_data.otp!, verification.otp);

    if(isOTPValid && new Date() > verification.expiresAt){
      return NextResponse.json({
        status: 400,
        message: "OTP has expired. Please request a new OTP.",
      });
    }
        
    if (!isOTPValid) {
      return NextResponse.json({ message: "Invalid OTP", status: 400 });
    }
    

    const hashedPassword = await bcrypt.hash(password!, 10);

    await prisma.admin.create({
      data: {
        email: email!,
        f_name: f_name,
        role: role,
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
