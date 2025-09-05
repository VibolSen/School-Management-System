"use client";

import React, { useState, useEffect } from "react";
import CourseTable from "@/components/course/CourseTable";
import AddCourseModal from "@/components/course/AddCourseModal";
import ConfirmationModal from "@/components/e-library/ConfirmationModal";

const CourseManagementView = () => {
  const [courseList, setCourseList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [courseToDelete, setCourseToDelete] = useState(null);

  // Load real data from API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("/api/courses");
        const data = await res.json();
        setCourseList(data);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      }
    };
    fetchCourses();
  }, []);

  const handleAddClick = () => {
    setEditingCourse(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (course) => {
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCourse(null);
  };

  const handleDeleteRequest = (course) => {
    setCourseToDelete(course);
  };

  const handleConfirmDelete = async () => {
    if (!courseToDelete) return;
    try {
      await fetch(`/api/courses?id=${courseToDelete.id}`, {
        method: "DELETE",
      });
      setCourseList(courseList.filter((c) => c.id !== courseToDelete.id));
      setCourseToDelete(null);
    } catch (err) {
      console.error("Failed to delete course:", err);
    }
  };

  const handleSaveCourse = async (courseData) => {
    try {
      if (editingCourse) {
        // Update existing course
        const res = await fetch(`/api/courses?id=${editingCourse.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(courseData),
        });
        const updatedCourse = await res.json();
        setCourseList(
          courseList.map((c) => (c.id === updatedCourse.id ? updatedCourse : c))
        );
      } else {
        // Add new course - you'll need to set instructorId based on your auth system
        const courseWithInstructor = {
          ...courseData,
          instructorId: "S001", // Replace with actual instructor ID from your auth system
        };

        const res = await fetch("/api/courses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(courseWithInstructor),
        });
        const newCourse = await res.json();
        setCourseList([...courseList, newCourse]);
      }
      handleCloseModal();
    } catch (err) {
      console.error("Failed to save course:", err);
    }
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
              <strong>{courseToDelete?.title}</strong>"?{" "}
              {/* Changed from 'name' to 'title' */}
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
