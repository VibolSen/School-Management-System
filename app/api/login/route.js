import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return new Response(JSON.stringify({ error: "Invalid email or password" }), { status: 401 });
    }

    // Check password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return new Response(JSON.stringify({ error: "Invalid email or password" }), { status: 401 });
    }

    // Optional: update lastLogin
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // Return success (never send password)
    const { password: _, ...userWithoutPassword } = user;
    return new Response(JSON.stringify({ message: "Login successful", user: userWithoutPassword }), {
      status: 200,
    });
  } catch (error) {
    console.error("Login API error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
