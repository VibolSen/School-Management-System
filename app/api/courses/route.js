import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const courseInclude = {
  instructor: { select: { name: true } }, // Select only what's needed
  department: { select: { name: true } }, // Select only what's needed
  groups: { select: { id: true, name: true } },
};

// ===== GET all courses with filtering, searching, and sorting =====
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

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

    // --- NEW: Logic for Server-Side Search, Filter, and Sort ---
    const departmentId = searchParams.get("departmentId");
    const search = searchParams.get("search"); // For searching
    const sortBy = searchParams.get("sortBy"); // For sorting column
    const sortOrder = searchParams.get("sortOrder"); // For sorting direction (asc/desc)

    // 1. Build WHERE clause for filtering and searching
    const whereClause = {};
    if (departmentId) {
      whereClause.departmentId = departmentId;
    }
    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { instructor: { name: { contains: search, mode: "insensitive" } } },
        { department: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    // 2. Build ORDER BY clause for sorting
    const orderByClause = {};
    if (sortBy && sortOrder) {
      if (sortBy === "instructor") {
        orderByClause.instructor = { name: sortOrder };
      } else if (sortBy === "department") {
        orderByClause.department = { name: sortOrder };
      } else {
        orderByClause[sortBy] = sortOrder;
      }
    } else {
      // Default sort order
      orderByClause.title = "asc";
    }

    // 3. Execute the final query
    const courses = await prisma.course.findMany({
      where: whereClause,
      include: courseInclude,
      orderBy: orderByClause,
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
      include: courseInclude, // Include relations on create
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
          ? { set: groupIds.map((id) => ({ id })) }
          : undefined,
      },
      include: courseInclude, // Include relations on update
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
