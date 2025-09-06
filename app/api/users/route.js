import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

// GET Users or single user
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const role = searchParams.get("role"); // Optional role filter

  if (id) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });
    if (!user)
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    return new Response(JSON.stringify(user), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Filter by role if provided
  const whereClause = role
    ? { role: { name: role } } 
    : {};

  const users = await prisma.user.findMany({
    where: whereClause,
    include: { role: true },
  });

  return new Response(JSON.stringify(users), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

// CREATE User
export async function POST(req) {
  const data = await req.json();

  if (!data.email || !data.password) {
    return new Response(
      JSON.stringify({ error: "Email and password are required" }),
      { status: 400 }
    );
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        name: data.name || null,
        email: data.email,
        password: hashedPassword,
        role: { connect: { id: data.roleId || "students" } },
        department: data.department || null,
        position: data.position || null,
        contactNumber: data.contactNumber || null,
        image: data.image || null,
        enrollmentDate: data.enrollmentDate
          ? new Date(data.enrollmentDate)
          : null,
        studentStatus: data.studentStatusId
          ? { connect: { id: data.studentStatusId } }
          : undefined,
        isActive: true,
      },
      include: { role: true },
    });

    return new Response(JSON.stringify(user), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Create user error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
}

// UPDATE User
export async function PUT(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id)
    return new Response(JSON.stringify({ error: "User ID required" }), { status: 400 });

  const data = await req.json();

  try {
    const updatePayload = { ...data, updatedAt: new Date() };

    // Hash password if provided
    if (data.password) {
      updatePayload.password = await bcrypt.hash(data.password, SALT_ROUNDS);
    } else {
      delete updatePayload.password;
    }

    // Role update
    if (data.roleId) {
      const roleExists = await prisma.roleEnum.findUnique({ where: { id: data.roleId } });
      if (!roleExists) {
        return new Response(JSON.stringify({ error: `Role '${data.roleId}' does not exist` }), { status: 400 });
      }
      updatePayload.role = { connect: { id: data.roleId } };
      delete updatePayload.roleId;
    }

    // Student status update
    if (data.studentStatusId) {
      updatePayload.studentStatus = { connect: { id: data.studentStatusId } };
      delete updatePayload.studentStatusId;
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updatePayload,
      include: { role: true },
    });

    return new Response(JSON.stringify(updatedUser), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Update user error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
}

// DELETE User
export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id)
    return new Response(JSON.stringify({ error: "User ID required" }), { status: 400 });

  try {
    const deletedUser = await prisma.user.delete({
      where: { id },
      include: { role: true },
    });
    return new Response(JSON.stringify(deletedUser), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Delete user error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
}
