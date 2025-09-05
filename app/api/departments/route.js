import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET all departments or GET by ?id=
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (id) {
    const department = await prisma.department.findUnique({
      where: { id },
    });

    if (!department) {
      return new Response(JSON.stringify({ error: "Department not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(department), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const departments = await prisma.department.findMany();

  return new Response(JSON.stringify(departments), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

// POST new department
export async function POST(req) {
  const data = await req.json();

  try {
    const department = await prisma.department.create({
      data: {
        name: data.name,
        description: data.description || null,
      },
    });

    return new Response(JSON.stringify(department), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }
}

// PUT (update department by ?id=)
export async function PUT(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id)
    return new Response(JSON.stringify({ error: "Department ID required" }), {
      status: 400,
    });

  const data = await req.json();

  try {
    const updatedDepartment = await prisma.department.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description || null,
        updatedAt: new Date(),
      },
    });

    return new Response(JSON.stringify(updatedDepartment), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }
}

// DELETE department by ?id=
export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id)
    return new Response(JSON.stringify({ error: "Department ID required" }), {
      status: 400,
    });

  try {
    const deletedDepartment = await prisma.department.delete({
      where: { id },
    });

    return new Response(JSON.stringify(deletedDepartment), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }
}
