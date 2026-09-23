import { NextResponse } from "next/server";
import { admin_data } from "@/interfaces";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {  

  try {
    const req_data: admin_data = await request.json();

    const admin = await prisma.admin.findUnique({
      where: {
        email: req_data.email,
      },
    });

    if (!admin) {
      return NextResponse.json({
        message: "this user is not an Admin",
        isAdmin:false,           
      },
      {status: 401}
    );
    }

    return NextResponse.json({
      message: "This user is an admin",      
      isAdmin:true
    },
    {status: 200}
  );

    
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Something went wrong", status: 500 },
      { status: 500 },
    );
  }
}
