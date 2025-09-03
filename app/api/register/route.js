import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    // Ensure "students" role exists
    await prisma.roleEnum.upsert({
      where: { id: "students" },
      update: {},
      create: { id: "students", name: "Students" },
    });

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return new Response(JSON.stringify({ error: "User already exists" }), { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        roleId: "students",
      },
    });

    const { password: _, ...userWithoutPassword } = newUser;
    return new Response(
      JSON.stringify({ message: "User registered successfully", user: userWithoutPassword }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Register API error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
