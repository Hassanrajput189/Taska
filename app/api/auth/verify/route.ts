import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();

    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Session Expired",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      token,
    },
    {status :200}
  );

  } catch (error) {
    console.error("Token API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to get token",
      },
      {
        status: 500,
      }
    );
  }
}