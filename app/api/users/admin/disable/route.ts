import { NextResponse } from "next/server";
import { user_data } from "@/interfaces";
import { prisma } from "@/lib/db";

export async function PATCH(request: Request) {
  try {
    const req_data: user_data = await request.json();

    // Validate email
    if (!req_data.email) {
      return NextResponse.json(
        {
          message: "Email is required",
          status: 400,
        },
      );
    }

    

    

    // Check if target user exists
    const existing = await prisma.user.findUnique({
      where: {
        email: req_data.email,
      },
    });

    if (!existing) {
      return NextResponse.json(
        {
          message: "No user exists with this email",
          status: 404,
        },        
      );
    }
    // Validate is_active
    if (existing.is_active === undefined) {
      return NextResponse.json(
        {
          message: "is_active is required",
          status: 400,
        },        
      );
    }

    const updated_is_active = !existing.is_active
    // Update user status
    const updatedUser = await prisma.user.update({
      where: {
        email: req_data.email,
      },
      data: {
        is_active: updated_is_active,
      },
    });

    
    return NextResponse.json(
      {
        message: updated_is_active
          ? "User enabled successfully"
          : "User disabled successfully",
        status: 200,
        user: updatedUser,
      },
    );
  } catch (error: any) {
    console.error("Update user status error:", error);

    return NextResponse.json(
      {
        message: "Failed to update user status",
        status: 500,
        error: error.message,
      }, 
    );
  }
}