import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function PUT(request, { params }) {
  try {
    const { id } = params; // id is a string (UUID)
    const body = await request.json();
    const {
      name,
      email,
      roleId,
      department,
      position,
      contactNumber,
      isActive,
      password,
      // Student-specific fields
      enrollmentDate,
      studentStatusId,
      courseIds = [], // Array of course IDs for current enrollments
    } = body;

    console.log("Update data received:", body);

    const updateData = {
      name,
      email,
      department,
      position,
      contactNumber,
      isActive,
      enrollmentDate: enrollmentDate ? new Date(enrollmentDate) : null,
      studentStatusId: studentStatusId, // Update overall student status
    };

    // Handle roleId as string (UUID or text)
    if (roleId && typeof roleId === "string" && roleId.trim() !== "") {
      updateData.roleId = roleId;
    }

    // Only update password if provided
    if (password && password.trim() !== "") {
      updateData.password = await bcrypt.hash(password, 12);
    }

    // --- Handle Course Enrollments ---
    // Get existing enrollments for the student
    const existingEnrollments = await prisma.enrollment.findMany({
      where: { studentId: id },
      select: { courseId: true },
    });
    const existingCourseIds = new Set(
      existingEnrollments.map((e) => e.courseId)
    );

    // Determine courses to add and remove
    const coursesToAdd = courseIds.filter((cid) => !existingCourseIds.has(cid));
    const coursesToRemove = Array.from(existingCourseIds).filter(
      (cid) => !courseIds.includes(cid)
    );

    // Create new enrollments
    if (coursesToAdd.length > 0) {
      const defaultEnrollmentStatus =
        await prisma.enrollmentStatusEnum.findFirst({
          where: { name: "Enrolled" },
        });
      if (!defaultEnrollmentStatus) {
        throw new Error("Default 'Enrolled' status not found.");
      }
      await prisma.enrollment.createMany({
        data: coursesToAdd.map((courseId) => ({
          studentId: id,
          courseId: courseId,
          statusId: defaultEnrollmentStatus.id,
          enrolledAt: new Date(),
        })),
      });
    }

    // Delete removed enrollments
    if (coursesToRemove.length > 0) {
      await prisma.enrollment.deleteMany({
        where: {
          studentId: id,
          courseId: { in: coursesToRemove },
        },
      });
    }

    const user = await prisma.user.update({
      where: { id }, // UUID string
      data: updateData,
      include: {
        enrollments: true,
        studentStatus: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: `Failed to update user: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  try {
    const { id } = params; // UUID string
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        role: true,
        studentStatus: true,
        enrollments: {
          include: {
            course: true,
            status: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const formattedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role?.name || "No Role",
      roleId: user.roleId,
      isActive: user.isActive,
      createdAt: user.createdAt,
      department: user.department,
      position: user.position,
      contactNumber: user.contactNumber,
      enrollmentDate: user.enrollmentDate?.toISOString().split("T")[0], // Format date for input
      status: user.studentStatus?.name || "N/A", // Overall student status
      studentStatusId: user.studentStatusId,
      courses: user.enrollments.map((e) => ({
        id: e.course.id,
        name: e.course.title,
        enrollmentStatus: e.status.name,
        enrollmentStatusId: e.status.id,
        enrolledAt: e.enrolledAt,
        progress: e.progress,
      })),
    };

    return NextResponse.json(formattedUser);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params; // UUID string

    // First, delete related enrollments
    await prisma.enrollment.deleteMany({
      where: { studentId: id },
    });

    // Then delete the user
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "User and related enrollments deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: `Failed to delete user: ${error.message}` },
      { status: 500 }
    );
  }
}
