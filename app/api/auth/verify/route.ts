import { NextResponse } from "next/server";
import { authenticateToken } from "@/lib/middleware/auth";

export async function GET(request: Request) {
  try {
    const authResult = await authenticateToken(request);

    if (authResult.error) {
      return NextResponse.json(
        {
          message: authResult.error,
          status: authResult.status,
        },
      
      );
    }

    return NextResponse.json(
      {
        status: 200,
        user: authResult.user,
      },
      
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Something went wrong",
        status: 500,
      },
      
    );
  }
}