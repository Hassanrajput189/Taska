import { NextResponse } from "next/server";
import { user_data } from "@/interfaces";
import { prisma } from "@/lib/db";

export async function PATCH(request: Request) {
  try {
    const req_data = await request.json();

    const { email, f_name, role, admin_email } = req_data as user_data;

    // Email identifies which user to update
    if (!email) {
      return NextResponse.json({
        message: "Email is required",
        status: 400,
      });
    }

    // Only an admin may perform this update
    if (!admin_email) {
      return NextResponse.json({
        message: "Admin email is required",
        status: 400,
      });
    }

    const admin = await prisma.admin.findUnique({
      where: {
        email: admin_email,
      },
    });

    if (!admin) {
      return NextResponse.json({
        message: "Only an admin can edit users",
        status: 403,
      });
    }

    // Confirm the target user exists
    const existing = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!existing) {
      return NextResponse.json({
        message: "No user exists with this email",
        status: 404,
      });
    }

    // Only name and role are editable here
    const updateData: { f_name?: string; role?: string } = {};
    if (f_name !== undefined) updateData.f_name = f_name;
    if (role !== undefined) updateData.role = role;

    const updatedUser = await prisma.user.update({
      where: {
        email,
      },
      data: updateData,
    });

    return NextResponse.json({
      message: "User updated successfully!",
      status: 200,
      user: updatedUser,
    });
  } catch (error: any) {
    console.error("Update user error:", error);

    return NextResponse.json({
      message: "Failed to update user",
      status: 500,
      error: error.message,
    });
  }
}
