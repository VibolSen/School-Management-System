"use client";

import React, { useState } from "react";
import CourseTable from "@/components/course/CourseTable";
import AddCourseModal from "@/components/course/AddCourseModal";
import ConfirmationModal from "@/components/ConfirmationModal";
import { MOCK_COURSES, MOCK_STUDENT_DATA } from "@/lib/constants";
import type { Course } from "@/lib/types";

const CourseManagementView: React.FC = () => {
  const [courseList, setCourseList] = useState<Course[]>(MOCK_COURSES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  const handleAddClick = () => {
    setEditingCourse(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (course: Course) => {
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCourse(null);
  };

  const handleDeleteRequest = (course: Course) => {
    setCourseToDelete(course);
  };

  const handleConfirmDelete = () => {
    if (!courseToDelete) return;

    const courseId = courseToDelete.id;
    // Update course list
    const newCourseList = courseList.filter((c) => c.id !== courseId);
    setCourseList(newCourseList);
    MOCK_COURSES.splice(0, MOCK_COURSES.length, ...newCourseList);

    // Remove course from any students enrolled in it
    MOCK_STUDENT_DATA.forEach((student) => {
      student.courses = student.courses.filter((c) => c.id !== courseId);
    });

    setCourseToDelete(null); // Close the confirmation modal
  };

  const handleSaveCourse = (courseData: Omit<Course, "id">) => {
    if (editingCourse) {
      // Update existing course
      const updatedCourse = { ...editingCourse, ...courseData };
      const newCourseList = courseList.map((c) =>
        c.id === editingCourse.id ? updatedCourse : c
      );
      setCourseList(newCourseList);
      MOCK_COURSES.splice(0, MOCK_COURSES.length, ...newCourseList);

      // Update the course details for any students enrolled in it
      MOCK_STUDENT_DATA.forEach((student) => {
        const courseIndex = student.courses.findIndex(
          (c) => c.id === editingCourse.id
        );
        if (courseIndex > -1) {
          student.courses[courseIndex] = updatedCourse;
        }
      });
    } else {
      // Add new course
      const newCourse: Course = {
        id: `C${(
          MOCK_COURSES.reduce(
            (max, c) => Math.max(max, parseInt(c.id.substring(1))),
            0
          ) + 1
        )
          .toString()
          .padStart(3, "0")}`,
        ...courseData,
      };
      const newCourseList = [...courseList, newCourse].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      setCourseList(newCourseList);
      MOCK_COURSES.splice(0, MOCK_COURSES.length, ...newCourseList);
    }
    handleCloseModal();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Course Management</h1>
      <p className="text-slate-500">
        Add, edit, and manage all available courses in the system.
      </p>
      <CourseTable
        courses={courseList}
        onAddCourseClick={handleAddClick}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteRequest}
      />
      <AddCourseModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSaveCourse={handleSaveCourse}
        courseToEdit={editingCourse}
      />
      <ConfirmationModal
        isOpen={!!courseToDelete}
        onClose={() => setCourseToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Course"
        message={
          <>
            <p>
              Are you sure you want to delete the course "
              <strong>{courseToDelete?.name}</strong>"?
            </p>
            <p className="mt-2">
              This action cannot be undone and will unenroll all students from
              this course.
            </p>
          </>
        }
      />
    </div>
  );
};

export default CourseManagementView;
