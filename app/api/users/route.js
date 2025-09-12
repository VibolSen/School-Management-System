import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

// GET Users or single user
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const role = searchParams.get("role"); // Optional role filter

    if (id) {
      const user = await prisma.user.findUnique({
        where: { id },
        include: { role: true, courses: true },
      });

      if (!user) {
        return new Response(JSON.stringify({ error: "User not found" }), {
          status: 404,
        });
      }

      return new Response(JSON.stringify(user), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // --- THIS IS THE MODIFIED SECTION ---
    const whereClause = {};
    if (role) {
      whereClause.role = {
        name: {
          equals: role,
          mode: "insensitive", // ✅ This makes the search case-insensitive
        },
      };
    }
    // --- END OF MODIFICATION ---

    const users = await prisma.user.findMany({
      where: whereClause,
      include: { role: true, courses: true },
    });

    return new Response(JSON.stringify(users), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("GET /users error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}

// CREATE User
export async function POST(req) {
  const data = await req.json();

  if (!data.email || !data.password || !data.roleId) {
    return new Response(
      JSON.stringify({ error: "Email, password, and roleId are required" }),
      { status: 400 }
    );
  }

  try {
    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        name: data.name || null,
        email: data.email,
        password: hashedPassword,
        role: { connect: { id: data.roleId } },
        enrollmentDate: data.enrollmentDate
          ? new Date(data.enrollmentDate)
          : null,
        isActive: data.isActive ?? true,
        courses: data.courseIds
          ? {
              connect: data.courseIds.map((id) => ({ id })),
            }
          : undefined,
      },
      include: { role: true },
    });

    return new Response(JSON.stringify(user), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Create user error:", error);
    if (error.code === "P2002" && error.meta?.target?.includes("email")) {
      return new Response(
        JSON.stringify({ error: "A user with this email already exists." }),
        { status: 409 }
      );
    }
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }
}

// UPDATE User
export async function PUT(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id)
    return new Response(JSON.stringify({ error: "User ID required" }), {
      status: 400,
    });

  const data = await req.json();

  try {
    const updatePayload = {
      name: data.name,
      email: data.email,
      isActive: data.isActive,
      enrollmentDate: data.enrollmentDate
        ? new Date(data.enrollmentDate)
        : null,
      updatedAt: new Date(),
    };

    if (data.password) {
      updatePayload.password = await bcrypt.hash(data.password, SALT_ROUNDS);
    }

    if (data.roleId) {
      updatePayload.role = { connect: { id: data.roleId } };
    }

    if (data.courseIds) {
      updatePayload.courses = {
        set: data.courseIds.map((id) => ({ id })),
      };
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updatePayload,
      include: { role: true },
    });

    return new Response(JSON.stringify(updatedUser), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Update user error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }
}

// DELETE User
export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id)
    return new Response(JSON.stringify({ error: "User ID required" }), {
      status: 400,
    });

  try {
    const deletedUser = await prisma.user.delete({
      where: { id },
    });
    return new Response(JSON.stringify(deletedUser), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Delete user error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }
}
