import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET all users or GET by ID with query ?id=...
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (id) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }
    return new Response(JSON.stringify(user), { status: 200, headers: { "Content-Type": "application/json" } });
  }

  const users = await prisma.user.findMany();
  return new Response(JSON.stringify(users), { status: 200, headers: { "Content-Type": "application/json" } });
}

// POST new user
export async function POST(req) {
  const data = await req.json();

  try {
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        roleId: data.roleId || "students",
        department: data.department,
        position: data.position,
        contactNumber: data.contactNumber,
        image: data.image,
        enrollmentDate: data.enrollmentDate ? new Date(data.enrollmentDate) : null,
        studentStatusId: data.studentStatusId,
      },
    });

    return new Response(JSON.stringify(user), { status: 201, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
}

// PUT (update user by ?id=)
export async function PUT(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return new Response(JSON.stringify({ error: "User ID required" }), { status: 400 });

  const data = await req.json();

  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    return new Response(JSON.stringify(updatedUser), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
}

// DELETE user by ?id=
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
