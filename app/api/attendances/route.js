import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      const record = await prisma.attendance.findUnique({
        where: { id },
        include: { student: true, course: true },
      });
      return new Response(JSON.stringify(record), { status: 200 });
    }

    const records = await prisma.attendance.findMany({
      include: { student: true, course: true },
    });
    return new Response(JSON.stringify(records), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { studentId, courseId, date, status } = body;

    if (!studentId || !courseId || !date) {
      return new Response(JSON.stringify({ error: 'studentId, courseId, and date are required' }), { status: 400 });
    }

    const newRecord = await prisma.attendance.create({
      data: { studentId, courseId, date: new Date(date), status: status || 'ABSENT' },
    });

    return new Response(JSON.stringify(newRecord), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) return new Response(JSON.stringify({ error: 'Attendance ID is required' }), { status: 400 });

    const updatedRecord = await prisma.attendance.update({
      where: { id },
      data: updateData,
    });

    return new Response(JSON.stringify(updatedRecord), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return new Response(JSON.stringify({ error: 'Attendance ID is required' }), { status: 400 });

    await prisma.attendance.delete({ where: { id } });
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
