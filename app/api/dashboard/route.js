// app/api/dashboard/route.js
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Fetch users with their roles
    const users = await prisma.user.findMany({
      include: { role: true }, // only role, no studentStatus
    });

    // Last 5 attendance records
    const attendanceRecords = await prisma.attendance.findMany({
      orderBy: { date: "asc" },
      take: 5,
    });

    const attendanceData = attendanceRecords.map((r) => ({
      name: new Date(r.date).toLocaleDateString("en-US", { weekday: "short" }),
      Present: r.presentCount,
      Absent: r.absentCount,
    }));

    // Stats calculation
    const totalEnrolledStudents = users.filter(
      (u) => u.role?.name === "Students"
    ).length;

    const staffRoles = ["teacher", "admin", "hr", "faculty"];
    const totalStaff = users.filter(
      (u) => u.role && staffRoles.includes(u.role.name.toLowerCase())
    ).length;

    const staffOnLeave = users.filter(
      (u) =>
        u.role &&
        staffRoles.includes(u.role.name.toLowerCase()) &&
        u.status === "On Leave"
    ).length;

    return NextResponse.json({
      users,
      stats: { totalEnrolledStudents, totalStaff, staffOnLeave },
      attendance: attendanceData,
    });
  } catch (error) {
    console.error("GET /api/dashboard error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
