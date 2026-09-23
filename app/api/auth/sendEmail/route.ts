import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";
import { sendVerificationEmail } from "@/resend/sendVerificationEmail";

export async function POST(request: Request) {
  try {
    const req_data = await request.json();

    const existing = await prisma.admin.findUnique({
      where: {
        email: req_data.email,
      },
    });

    if (existing) {
      return NextResponse.json({ message: "User already exists", status: 409 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const emailSent = await sendVerificationEmail(
      req_data.email!,
      req_data.f_name!,
      otp,
    );

    console.log("Email result:", emailSent);

    if (!emailSent.success) {
      return NextResponse.json({ message: emailSent.message }, { status: 500 });
    }

    const hashedOTP = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await prisma.emailVerification.upsert({
      where: {
        email: req_data.email!,
      },
      update: {
        otp: hashedOTP,
        expiresAt,
      },
      create: {
        email: req_data.email!,
        otp: hashedOTP,
        expiresAt,
      },
    });
    return NextResponse.json({
      message: "OTP email sent successfully",
      status: 200,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ message: "Something went wrong", status: 500 });
  }
}
