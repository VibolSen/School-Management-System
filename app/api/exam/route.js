import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ===== POST =====
export async function POST(req) {
  try {
    const data = await req.json();
    console.log("Received exam data:", data);

    // --- Create new exam ---
    const newExam = await prisma.exam.create({
      data: {
        title: data.title,
        description: data.description,
        startDate: new Date(data.startDate),
        duration: data.duration,
        courseId: data.courseId,
        instructorId: data.instructorId, // This needs to be passed from the frontend
      },
    });

    return new Response(JSON.stringify(newExam), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("POST Exam error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }
}
