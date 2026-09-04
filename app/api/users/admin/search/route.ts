import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { user_data } from "@/interfaces";

export async function POST(request: NextRequest) {
  try {
    const req_data: user_data = await request.json();

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

    if (!query || query.trim() === "") {
      return NextResponse.json({
        status: 400,
      });
    }

    const searchValue = query.trim();

    const users = await prisma.user.findMany({
      where: {
        NOT: {
          email: req_data.email,
        },
        OR: [
          {
            f_name: {
              contains: searchValue,
            },
          },
          {
            email: {
              contains: searchValue,
            },
          },
          {
            role: {
              contains: searchValue,
            },
          },
        ],
      },
    });

    if (users.length === 0) {
      return NextResponse.json({
        status: 404,
      });
    }

    return NextResponse.json({
      status: 200,
      users,
    });
  } catch (error) {
    console.error("Search error:", error);

    return NextResponse.json({
      status: 500,
      message: "Internal server error",
    });
  }
}