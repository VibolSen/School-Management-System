import prisma from "@/lib/prisma"; // using singleton Prisma client

// ✅ GET (all groups or by id)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    let groups;

    if (id) {
      const group = await prisma.group.findUnique({
        where: { id },
        include: {
          members: { include: { student: true } },
          assignments: true, // correct field name
        },
      });
      groups = group ? [group] : []; // always an array
    } else {
      groups = await prisma.group.findMany({
        include: {
          members: { include: { student: true } },
          assignments: true, // correct field name
        },
      });
    }

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

// ✅ POST (create new group)
export async function POST(req) {
  try {
    const data = await req.json();
    if (!data.name) {
      return new Response(JSON.stringify({ error: "Group name is required" }), {
        status: 400,
      });
    }

    const newGroup = await prisma.group.create({
      data: {
        name: data.name,
        description: data.description || "",
        courseId: data.courseId,
      },
      include: {
        members: { include: { student: true } },
        assignments: true,
      },
    });

    return new Response(JSON.stringify([newGroup]), {
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

// ✅ PUT (update group)
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

    const updatedGroup = await prisma.group.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        courseId: data.courseId,
      },
      include: {
        members: { include: { student: true } },
        assignments: true,
      },
    });

    return new Response(JSON.stringify([updatedGroup]), {
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

    const deletedGroup = await prisma.group.delete({
      where: { id },
    });

    return new Response(JSON.stringify([deletedGroup]), {
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
