// app/api/dashboard/route.js
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Fetch users and attendance data from DB
    const users = await prisma.user.findMany({
      include: { studentStatus: true }, // include relations if needed
    });

    // Example: if you have attendance table in DB
    const attendanceRecords = await prisma.attendance.findMany({
      orderBy: { date: "asc" },
      take: 5, // last 5 days
    });

    // Transform attendance for Recharts
    const attendanceData = attendanceRecords.map((r) => ({
      name: new Date(r.date).toLocaleDateString("en-US", { weekday: "short" }),
      Present: r.presentCount,
      Absent: r.absentCount,
    }));

    // Calculate stats
    const totalEnrolledStudents = users.filter(
      (u) =>
        u.role === "student" &&
        (u.status === "Enrolled" || u.studentStatus?.name === "Enrolled")
    ).length;

    const staffRoles = ["teacher", "admin", "hr", "faculty"];
    const totalStaff = users.filter((u) => staffRoles.includes(u.role)).length;

    const staffOnLeave = users.filter(
      (u) => staffRoles.includes(u.role) && u.status === "On Leave"
    ).length;

    return NextResponse.json({
      users,
      stats: {
        totalEnrolledStudents,
        totalStaff,
        staffOnLeave,
      },
      attendance: attendanceData,
    });
  } catch (error) {
    console.error("GET /api/dashboard error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
