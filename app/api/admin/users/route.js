import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// GET /api/admin/users?role=student
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const roleName = searchParams.get("role"); // e.g., "student" or "staff"

    const where = roleName
      ? { role: { name: roleName } } // filter users by role name
      : {};

    const users = await prisma.user.findMany({
      where,
      include: { role: true },
      orderBy: { createdAt: "desc" },
    });

    const formattedUsers = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role?.name || "No Role",
      roleId: user.roleId,
      isActive: user.isActive,
      createdAt: user.createdAt,
      department: user.department,
      position: user.position,
      contactNumber: user.contactNumber,
    }));

    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST /api/admin/users
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      password,
      roleId,
      department,
      position,
      contactNumber,
    } = body;

    // Validate required fields
    if (!name || !email || !password || !roleId) {
      return NextResponse.json(
        { error: "Name, email, password, and roleId are required" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        roleId,
        department,
        position,
        contactNumber,
        isActive: true,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
