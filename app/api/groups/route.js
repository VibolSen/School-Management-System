import prisma from "@/lib/prisma"; // using singleton Prisma client

// ✅ GET (all groups or by id)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const includeOptions = {
      members: {
        include: {
          student: {
            select: { id: true, name: true, email: true }, // Select only needed fields
          },
        },
      },
      assignments: true,
    };

    if (id) {
      const group = await prisma.group.findUnique({
        where: { id },
        include: includeOptions,
      });

      if (!group) {
        return new Response(JSON.stringify({ error: "Group not found" }), {
          status: 404,
        });
      }
      return new Response(JSON.stringify(group), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const groups = await prisma.group.findMany({
      include: includeOptions,
    });

    return new Response(JSON.stringify(groups), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("GET Group error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

// ✅ POST (create new group with members)
export async function POST(req) {
  try {
    const data = await req.json();
    const { name, description, courseId, studentIds = [] } = data;

    if (!name) {
      return new Response(JSON.stringify({ error: "Group name is required" }), {
        status: 400,
      });
    }

    const newGroup = await prisma.group.create({
      data: {
        name,
        description: description || "",
        courseId,
        members: {
          create: studentIds.map((studentId) => ({
            student: { connect: { id: studentId } },
          })),
        },
      },
      include: {
        members: { include: { student: { select: { id: true, name: true } } } },
        assignments: true,
      },
    });

    return new Response(JSON.stringify(newGroup), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("POST Group error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }
}

// ✅ PUT (update group and its members)
export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return new Response(JSON.stringify({ error: "Group ID is required" }), {
        status: 400,
      });
    }

    const data = await req.json();
    const { name, description, courseId, studentIds } = data;

    const updatedGroup = await prisma.$transaction(async (tx) => {
      await tx.group.update({
        where: { id },
        data: { name, description, courseId },
      });

      if (Array.isArray(studentIds)) {
        await tx.groupMember.deleteMany({ where: { groupId: id } });
        if (studentIds.length > 0) {
          await tx.groupMember.createMany({
            data: studentIds.map((studentId) => ({
              groupId: id,
              studentId: studentId,
            })),
          });
        }
      }

      return tx.group.findUnique({
        where: { id },
        include: {
          members: {
            include: { student: { select: { id: true, name: true } } },
          },
          assignments: true,
        },
      });
    });

    return new Response(JSON.stringify(updatedGroup), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("PUT Group error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }
}

// ✅ DELETE (remove group)
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return new Response(JSON.stringify({ error: "Group ID is required" }), {
        status: 400,
      });
    }

    const deletedGroup = await prisma.group.delete({ where: { id } });

    return new Response(JSON.stringify(deletedGroup), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("DELETE Group error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }
}
