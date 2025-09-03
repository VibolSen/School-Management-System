import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export async function GET(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { role: true },
    });

    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

    const { password: _, ...userWithoutPassword } = user;
    return new Response(JSON.stringify({ user: userWithoutPassword }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
}
