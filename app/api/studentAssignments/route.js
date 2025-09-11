import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ===== GET =====
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const statusId = searchParams.get("statusId");
    const courseId = searchParams.get("courseId");
    const departmentId = searchParams.get("departmentId");

    if (id) {
      const assignment = await prisma.studentAssignment.findUnique({
        where: { id },
        include: {
          groupAssignment: { include: { group: true } },
          activity: { include: { course: { include: { department: true } } } },
        },
      });

      if (!assignment) {
        return new Response(JSON.stringify({ error: "Assignment not found" }), {
          status: 404,
        });
      }

      return new Response(JSON.stringify(assignment), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const where = {};
    if (statusId) where.statusId = statusId;
    if (courseId || departmentId) {
      where.activity = {};
      if (courseId) where.activity.courseId = courseId;
      if (departmentId) where.activity.course = { departmentId };
    }

    const assignments = await prisma.studentAssignment.findMany({
      where,
      include: {
        groupAssignment: { include: { group: true } },
        activity: { include: { course: { include: { department: true } } } },
      },
    });

    return new Response(JSON.stringify(assignments), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("GET StudentAssignment error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

// ===== POST =====
export async function POST(req) {
  try {
    const data = await req.json();

    if (!data.activityId)
      return new Response(JSON.stringify({ error: "activityId is required" }), {
        status: 400,
      });
    if (!data.statusId)
      return new Response(JSON.stringify({ error: "statusId is required" }), {
        status: 400,
      });
    if (!data.groupId)
      return new Response(JSON.stringify({ error: "groupId is required" }), {
        status: 400,
      });

    const payload = {
      activityId: data.activityId,
      groupAssignmentId: data.groupId,
      statusId: data.statusId,
      submittedAt: data.submittedAt ? new Date(data.submittedAt) : null,
      content: data.content?.trim() || null,
      fileUrl: data.fileUrl?.trim() || null,
      grade: data.grade !== "" ? parseFloat(data.grade) : null,
      feedback: data.feedback?.trim() || null,
    };

    const newAssignment = await prisma.studentAssignment.create({
      data: payload,
      include: {
        groupAssignment: { include: { group: true } },
        activity: { include: { course: { include: { department: true } } } },
      },
    });

    return new Response(JSON.stringify(newAssignment), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("POST StudentAssignment error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }
}

// ===== PUT =====
export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id)
      return new Response(
        JSON.stringify({ error: "StudentAssignment ID is required" }),
        { status: 400 }
      );

    const data = await req.json();
    const updateData = {
      statusId: data.statusId,
      submittedAt: data.submittedAt ? new Date(data.submittedAt) : null,
      content: data.content || null,
      fileUrl: data.fileUrl || null,
      grade: data.grade ? parseFloat(data.grade) : null,
      feedback: data.feedback || null,
    };

    if (data.groupId) updateData.groupAssignmentId = data.groupId;

    const updatedAssignment = await prisma.studentAssignment.update({
      where: { id },
      data: updateData,
      include: {
        groupAssignment: { include: { group: true } },
        activity: { include: { course: { include: { department: true } } } },
      },
    });

    return new Response(JSON.stringify(updatedAssignment), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("PUT StudentAssignment error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }
}

// ===== DELETE =====
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id)
      return new Response(
        JSON.stringify({ error: "StudentAssignment ID is required" }),
        { status: 400 }
      );

    const deletedAssignment = await prisma.studentAssignment.delete({
      where: { id },
    });

    return new Response(JSON.stringify(deletedAssignment), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("DELETE StudentAssignment error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }
}
