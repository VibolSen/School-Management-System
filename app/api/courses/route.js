import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const courseInclude = {
  instructor: true,
  department: true,
  groups: { select: { id: true, name: true } },
};

// ===== GET all courses, by ?id=, or by ?departmentId= =====
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const departmentId = searchParams.get("departmentId"); // ✅ ADD this line to read the department ID

    // Handle request for a single course by its ID
    if (id) {
      const course = await prisma.course.findUnique({
        where: { id },
        include: courseInclude,
      });
      if (!course) {
        return new Response(JSON.stringify({ error: "Course not found" }), {
          status: 404,
        });
      }
      return new Response(JSON.stringify(course), { status: 200 });
    }

    // ✅ ADD this block to handle filtering by department
    // This is the core of the fix.
    const whereClause = {};
    if (departmentId) {
      whereClause.departmentId = departmentId;
    }

    // Fetch courses using the where clause (it will be empty if no filter is applied)
    const courses = await prisma.course.findMany({
      where: whereClause, // ✅ APPLY the filter here
      include: courseInclude,
    });

    return new Response(JSON.stringify(courses), { status: 200 });
  } catch (error) {
    console.error("GET courses error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

// ===== POST create a new course =====
export async function POST(req) {
  try {
    const data = await req.json();
    const { title, instructorId, departmentId, groupIds = [] } = data;

    const course = await prisma.course.create({
      data: {
        title,
        instructorId,
        departmentId,
        groups: {
          connect: groupIds.map((id) => ({ id })),
        },
      },
    });

    return new Response(JSON.stringify(course), { status: 201 });
  } catch (error) {
    console.error("Create course error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }
}

// ===== PUT update a course by ?id= =====
export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return new Response(JSON.stringify({ error: "Course ID required" }), {
        status: 400,
      });
    }

    const data = await req.json();
    const { title, instructorId, departmentId, groupIds } = data;

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: {
        title,
        instructorId,
        departmentId,
        groups: Array.isArray(groupIds)
          ? {
              set: groupIds.map((id) => ({ id })),
            }
          : undefined,
      },
    });

    return new Response(JSON.stringify(updatedCourse), { status: 200 });
  } catch (error) {
    console.error("Update course error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }
}

// ===== DELETE a course by ?id= =====
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return new Response(JSON.stringify({ error: "Course ID required" }), {
        status: 400,
      });
    }

    await prisma.course.delete({ where: { id } });
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Delete course error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
