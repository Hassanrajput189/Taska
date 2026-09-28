import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Returns every organization (admin) the given user email belongs to.
export async function POST(request: Request) {
  try {
    const { email } = (await request.json()) as { email?: string };

    if (!email) {
      return NextResponse.json(
        { message: "Email is required", admins: [] },
        { status: 400 },
      );
    }

    const rows = await prisma.user.findMany({
      where: { email },
      select: { admin_email: true },
    });

    const adminEmails = rows.map((r) => r.admin_email);

    const admins = adminEmails.length
      ? await prisma.admin.findMany({
          where: { email: { in: adminEmails } },
          select: { email: true, f_name: true },
        })
      : [];

    const nameByEmail = new Map(admins.map((a) => [a.email, a.f_name]));

    return NextResponse.json(
      {
        admins: adminEmails.map((admin_email) => ({
          admin_email,
          admin_name: nameByEmail.get(admin_email) ?? null,
        })),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("fetch_admin error:", error);
    return NextResponse.json(
      { message: "Something went wrong", admins: [] },
      { status: 500 },
    );
  }
}
