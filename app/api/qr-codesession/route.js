import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET all QRCodeSessions or GET by ?id=
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (id) {
    const qrCodeSession = await prisma.qRCodeSession.findUnique({
      where: { id },
      include: {
        attendances: true,
        course: true,
        createdBy: true,
      },
    });

    if (!qrCodeSession) {
      return new Response(
        JSON.stringify({ error: "QRCodeSession not found" }),
        {
          status: 404,
        }
      );
    }

    return new Response(JSON.stringify(qrCodeSession), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const qrCodeSessions = await prisma.qRCodeSession.findMany({
    include: {
      attendances: true,
      course: true,
      createdBy: true,
    },
  });

  return new Response(JSON.stringify(qrCodeSessions), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

// POST new QRCodeSession
export async function POST(req) {
  const data = await req.json();

  try {
    const qrCodeSession = await prisma.qRCodeSession.create({
      data: {
        courseId: data.courseId || null,
        createdById: data.createdById,
        qrCode: data.qrCode,
        expiresAt: new Date(data.expiresAt),
      },
    });

    return new Response(JSON.stringify(qrCodeSession), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }
}

// PUT (update QRCodeSession by ?id=)
export async function PUT(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id)
    return new Response(
      JSON.stringify({ error: "QRCodeSession ID required" }),
      {
        status: 400,
      }
    );

  const data = await req.json();

  try {
    const updatedQrCodeSession = await prisma.qRCodeSession.update({
      where: { id },
      data: {
        courseId: data.courseId || null,
        createdById: data.createdById,
        qrCode: data.qrCode,
        expiresAt: new Date(data.expiresAt),
      },
    });

    return new Response(JSON.stringify(updatedQrCodeSession), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }
}

// DELETE QRCodeSession by ?id=
export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id)
    return new Response(
      JSON.stringify({ error: "QRCodeSession ID required" }),
      {
        status: 400,
      }
    );

  try {
    const deletedQrCodeSession = await prisma.qRCodeSession.delete({
      where: { id },
    });

    return new Response(JSON.stringify(deletedQrCodeSession), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }
}
