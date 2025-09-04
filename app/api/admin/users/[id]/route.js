import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function PUT(request, { params }) {
  try {
    const { id } = params; // id is a string (UUID)
    const body = await request.json();
    const {
      name,
      email,
      roleId,
      department,
      position,
      contactNumber,
      isActive,
      password,
    } = body;

    console.log("Update data received:", body);

    const updateData = {
      name,
      email,
      department,
      position,
      contactNumber,
      isActive,
    };

    // Handle roleId as string (UUID or text)
    if (roleId && typeof roleId === "string" && roleId.trim() !== "") {
      updateData.roleId = roleId;
    }

    // Only update password if provided
    if (password && password.trim() !== "") {
      updateData.password = await bcrypt.hash(password, 12);
    }

    const user = await prisma.user.update({
      where: { id }, // UUID string
      data: updateData,
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: `Failed to update user: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  try {
    const { id } = params; // UUID string
    const user = await prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params; // UUID string

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
