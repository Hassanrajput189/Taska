import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const req_data = await request.json();

    const isAdmin = req_data.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;    
    
    return NextResponse.json({      
      isAdmin,
      status: 200,
    });
    
  } catch (error) {
    console.error(error);

    return NextResponse.json({
      message: "Something went wrong",
      status: 500,
    });
  }
}
