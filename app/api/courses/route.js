import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET all courses or GET by query ?id=
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (id) {
    const course = await prisma.course.findUnique({
      where: { id },
      include: { instructor: true, topics: true },
    });
    if (!course) {
      return new Response(JSON.stringify({ error: "Course not found" }), { status: 404 });
    }
    return new Response(JSON.stringify(course), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const courses = await prisma.course.findMany({
    include: { instructor: true, topics: true },
  });

  return new Response(JSON.stringify(courses), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

// POST new course
export async function POST(req) {
  const data = await req.json();

  try {
    const course = await prisma.course.create({
      data: {
        title: data.title,
        description: data.description,
        instructorId: data.instructorId,
        objectives: data.objectives,
        methodology: data.methodology,
        // topics can be added later via a separate endpoint
      },
    });

    return new Response(JSON.stringify(course), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
}

// PUT (update course by ?id=)
export async function PUT(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return new Response(JSON.stringify({ error: "Course ID required" }), { status: 400 });

  const data = await req.json();

  try {
    const updatedCourse = await prisma.course.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    return new Response(JSON.stringify(updatedCourse), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
}

// DELETE course by ?id=
export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return new Response(JSON.stringify({ error: "Course ID required" }), { status: 400 });

  try {
    const deletedCourse = await prisma.course.delete({ where: { id } });
    return new Response(JSON.stringify(deletedCourse), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
}
