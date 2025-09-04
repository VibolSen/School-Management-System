import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { isActive } = body;

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { isActive },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error updating user status:", error);
    return NextResponse.json(
      { error: "Failed to update user status" },
      { status: 500 }
    );
  }
}
