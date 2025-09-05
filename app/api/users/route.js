import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET Users or single user
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (id) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    return new Response(JSON.stringify(user), { status: 200, headers: { "Content-Type": "application/json" } });
  }

  const users = await prisma.user.findMany();
  return new Response(JSON.stringify(users), { status: 200, headers: { "Content-Type": "application/json" } });
}

// CREATE User
export async function POST(req) {
  const data = await req.json();

  if (!data.email || !data.password) {
    return new Response(JSON.stringify({ error: "Email and password are required" }), { status: 400 });
  }

  try {
    const user = await prisma.user.create({
      data: {
        name: data.name || null,
        email: data.email,
        password: data.password,
        role: { connect: { id: data.roleId || "students" } }, // default role
        department: data.department || null,
        position: data.position || null,
        contactNumber: data.contactNumber || null,
        image: data.image || null,
        enrollmentDate: data.enrollmentDate ? new Date(data.enrollmentDate) : null,
        studentStatus: data.studentStatusId ? { connect: { id: data.studentStatusId } } : undefined,
        isActive: true,
      },
    });

    return new Response(JSON.stringify(user), { status: 201, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
}

// UPDATE User
export async function PUT(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return new Response(JSON.stringify({ error: "User ID required" }), { status: 400 });

  const data = await req.json();

  try {
    const updatePayload = { ...data, updatedAt: new Date() };

    // Convert roleId to relation connect if provided
    if (data.roleId) {
      updatePayload.role = { connect: { id: data.roleId } };
      delete updatePayload.roleId; // <-- Remove roleId to avoid conflict
    }

    if (data.studentStatusId) {
      updatePayload.studentStatus = { connect: { id: data.studentStatusId } };
      delete updatePayload.studentStatusId;
    }

    // Remove empty password
    if (!data.password) delete updatePayload.password;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updatePayload,
    });

    return new Response(JSON.stringify(updatedUser), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
}


// DELETE User
export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return new Response(JSON.stringify({ error: "User ID required" }), { status: 400 });

  try {
    const deletedUser = await prisma.user.delete({ where: { id } });
    return new Response(JSON.stringify(deletedUser), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
}
