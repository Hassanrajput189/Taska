import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function DELETE(request: Request) {
  try {
    // Get request data
    const req_data = await request.json();

    const  email  = req_data.email;

    // Validate required field
    if (!email) {
      return NextResponse.json(
        {
          message: "Email is required",
          status: 400,
        },
        { status: 400 }
      );
    }

    // Attempt to delete the user
    await prisma.user.delete({
      where: {
        email: email,
      },
    });

    return NextResponse.json(
      {
        message: "User deleted successfully!",
        status: 200,
      },
      
    );
  } catch (error: any) {
    console.error("Delete user error:", error);

    // User was not found
    if (error.code === "P2025") {
      return NextResponse.json(
        {
          message: "User not found",
          status: 404,
        },
     
      );
    }

    // Foreign key constraint
    if (error.code === "P2003") {
      return NextResponse.json(
        {
          message:
            "Cannot delete this user because they are associated with existing tasks.",
          status: 409,
        },
     
      );
    }

    return NextResponse.json(
      {
        message: "Failed to delete user",
        status: 500,
        error: error.message,
      },
     
    );
  }
}