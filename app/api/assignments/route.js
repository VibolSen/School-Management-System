import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const parseDate = (d) => (d ? new Date(d) : null);
// ===== GET =====
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const statusId = searchParams.get("statusId");
    const courseId = searchParams.get("courseId");

    // ===== Get single assignment by ID =====
    if (id) {
      const assignment = await prisma.studentAssignment.findUnique({
        where: { id },
        include: {
          assignment: {
            include: {
              activity: true, // get activity name
              course: true, // get course title
            },
          },
          student: true, // get student name
          groupAssignment: { include: { group: true } }, // get group name
          status: true, // get status name
        },
      });

      if (!assignment) {
        return new Response(JSON.stringify({ error: "Assignment not found" }), {
          status: 404,
        });
      }

      // Map fields: replace IDs with names where possible
      const mapped = {
        ...assignment,
        assignment: {
          ...assignment.assignment,
          activityName:
            assignment.assignment?.activity?.name ||
            assignment.assignment?.activity?.title ||
            null,
          courseName: assignment.assignment?.course?.title || null,
        },
        studentName: assignment.student?.name || null,
        groupName: assignment.groupAssignment?.group?.name || null,
        statusName: assignment.status?.name || null,
      };

      return new Response(JSON.stringify(mapped), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // ===== Build filters for multiple assignments =====
    const where = {};

    if (statusId) where.statusId = statusId;

    if (courseId) {
      const courseAssignments = await prisma.assignment.findMany({
        where: { courseId },
        select: { id: true },
      });

      const assignmentIds = courseAssignments.map((a) => a.id).filter(Boolean);

      if (assignmentIds.length === 0) {
        return new Response(JSON.stringify([]), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      where.assignmentId = { in: assignmentIds };
    }

    // ===== Fetch all student assignments =====
    const assignments = await prisma.studentAssignment.findMany({
      where,
      include: {
        assignment: { include: { activity: true, course: true } },
        student: true,
        groupAssignment: { include: { group: true } },
        status: true,
      },
      orderBy: { submittedAt: "desc" },
    });

    // Map IDs to names for all assignments
    const mappedAssignments = assignments.map((a) => ({
      ...a,
      assignment: {
        ...a.assignment,
        activityName:
          a.assignment?.activity?.name || a.assignment?.activity?.title || null,
        courseName: a.assignment?.course?.title || null,
      },
      studentName: a.student?.name || null,
      groupName: a.groupAssignment?.group?.name || null,
      statusName: a.status?.name || null,
    }));

    return new Response(JSON.stringify(mappedAssignments), {
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

    // Minimal validation
    if (!data.statusId)
      return new Response(JSON.stringify({ error: "statusId is required" }), {
        status: 400,
      });
    if (!data.courseId)
      return new Response(JSON.stringify({ error: "courseId is required" }), {
        status: 400,
      });
    if (!data.activityId)
      return new Response(JSON.stringify({ error: "activityId is required" }), {
        status: 400,
      });
    if (!data.title)
      return new Response(JSON.stringify({ error: "title is required" }), {
        status: 400,
      });

    // Create Assignment
    const newAssignment = await prisma.assignment.create({
      data: {
        title: data.title,
        description: data.description || null,
        dueDate: parseDate(data.dueDate),
        courseId: data.courseId,
        activityId: data.activityId,
      },
    });

    // Create StudentAssignment
    const payload = {
      assignmentId: newAssignment.id,
      studentId: data.studentId || null,
      groupAssignmentId: data.groupId || null,
      statusId: data.statusId,
      submittedAt: parseDate(data.submittedAt) || new Date(),
      content: data.content?.trim() || null,
      fileUrl: data.fileUrl?.trim() || null,
      grade:
        data.grade !== "" && data.grade !== undefined
          ? parseFloat(data.grade)
          : null,
      feedback: data.feedback?.trim() || null,
    };

    // Ensure either studentId or groupAssignmentId exists
    if (!payload.studentId && !payload.groupAssignmentId)
      return new Response(
        JSON.stringify({ error: "studentId or groupId is required" }),
        { status: 400 }
      );

    const newStudentAssignment = await prisma.studentAssignment.create({
      data: payload,
      include: {
        assignment: true,
        student: true,
        groupAssignment: { include: { group: true } },
        status: true,
      },
    });

    return new Response(JSON.stringify(newStudentAssignment), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("POST error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

// ===== PUT =====
export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id)
      return new Response(JSON.stringify({ error: "ID required" }), {
        status: 400,
      });

    const data = await req.json();
    const updateData = {
      statusId: data.statusId,
      submittedAt: parseDate(data.submittedAt),
      content: data.content?.trim() || null,
      fileUrl: data.fileUrl?.trim() || null,
      grade:
        data.grade !== "" && data.grade !== undefined
          ? parseFloat(data.grade)
          : null,
      feedback: data.feedback?.trim() || null,
    };
    if (data.groupId !== undefined) updateData.groupAssignmentId = data.groupId;
    if (data.studentId !== undefined) updateData.studentId = data.studentId;

    const updatedAssignment = await prisma.studentAssignment.update({
      where: { id },
      data: updateData,
      include: {
        assignment: true,
        student: true,
        groupAssignment: { include: { group: true } },
        status: true,
      },
    });

    return new Response(JSON.stringify(updatedAssignment), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("PUT error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

// ===== DELETE =====
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id)
      return new Response(JSON.stringify({ error: "ID required" }), {
        status: 400,
      });

    const deletedAssignment = await prisma.studentAssignment.delete({
      where: { id },
    });
    return new Response(JSON.stringify(deletedAssignment), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("DELETE error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
