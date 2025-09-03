import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Find user with role info
    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "Invalid email or password" }), { status: 401 });
    }

    // Check password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return new Response(JSON.stringify({ error: "Invalid email or password" }), { status: 401 });
    }

    // Create JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1d" });

    const { password: _, ...userWithoutPassword } = user;

    return new Response(JSON.stringify({ user: userWithoutPassword, token }), { status: 200 });
  } catch (error) {
    console.error("Login API error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
