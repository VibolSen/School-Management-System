import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export async function GET(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader)
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });

    const token = authHeader.replace("Bearer ", "");

    // Log the raw token
    console.log("JWT Token:", token);

    const decoded = jwt.verify(token, JWT_SECRET);

    // Log the decoded token
    console.log("Decoded token:", decoded);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { role: true },
    });

    // Log the user fetched from DB
    console.log("User from DB:", user);

    if (!user)
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });

    const { password: _, ...userWithoutPassword } = user;

    // Log the final user object that will be returned
    console.log("User returned:", userWithoutPassword);

    return new Response(JSON.stringify({ user: userWithoutPassword }), {
      status: 200,
    });
  } catch (err) {
    console.error("Error in GET /user:", err);
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }
}
