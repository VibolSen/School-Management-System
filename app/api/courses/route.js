import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ===== GET all courses or GET by ?id= =====
export async function GET() {
  try {
    const courses = await prisma.course.findMany();
    return new Response(JSON.stringify(courses), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// ===== POST create a new course =====
export async function POST(req) {
  try {
    const data = await req.json();

    const course = await prisma.course.create({
      data: {
        title: data.title,
        description: data.description,
        instructorId: data.instructorId,
        department: data.department || null,
        objectives: data.objectives,
        methodology: data.methodology,
      },
    });

    return new Response(JSON.stringify(course), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Create course error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
}

// ===== PUT update a course by ?id= =====
export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return new Response(
        JSON.stringify({ error: "Course ID required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await req.json();

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        instructorId: data.instructorId,
        department: data.department || null,
        objectives: data.objectives,
        methodology: data.methodology,
        updatedAt: new Date(),
      },
    });

    return new Response(JSON.stringify(updatedCourse), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Update course error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
}

// ===== DELETE a course by ?id= =====
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return new Response(
        JSON.stringify({ error: "Course ID required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const deletedCourse = await prisma.course.delete({ where: { id } });

    return new Response(JSON.stringify(deletedCourse), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Delete course error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
}
