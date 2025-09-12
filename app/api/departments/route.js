import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const includeCourses = {
  courses: {
    select: { id: true, title: true },
  },
};

// GET all departments or GET by ?id=
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  try {
    if (id) {
      const department = await prisma.department.findUnique({
        where: { id },
        include: includeCourses,
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

    const departments = await prisma.department.findMany({
      include: includeCourses,
    });

    return new Response(JSON.stringify(departments), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("GET Departments error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

// POST new department
export async function POST(req) {
  const data = await req.json();
  const { name, description, courseIds = [] } = data;

  if (!name) {
    return new Response(
      JSON.stringify({ error: "Department name is required." }),
      { status: 400 }
    );
  }

  try {
    const department = await prisma.department.create({
      data: {
        name,
        description: description || null,
        courses: {
          connect: courseIds.map((id) => ({ id })),
        },
      },
      include: includeCourses,
    });

    return new Response(JSON.stringify(department), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("POST Department error:", error);
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
  const { name, description, courseIds } = data;

  try {
    const updatedDepartment = await prisma.department.update({
      where: { id },
      data: {
        name,
        description: description || null,
        // 'set' is the idiomatic way to replace all relations
        courses: Array.isArray(courseIds)
          ? {
              set: courseIds.map((id) => ({ id })),
            }
          : undefined,
        updatedAt: new Date(),
      },
      include: includeCourses,
    });

    return new Response(JSON.stringify(updatedDepartment), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("PUT Department error:", error);
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
    // Note: Prisma will handle disconnecting relations based on your schema's rules.
    const deletedDepartment = await prisma.department.delete({
      where: { id },
    });

    return new Response(JSON.stringify(deletedDepartment), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("DELETE Department error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }
}
