"use client";

import React, { useState, useEffect } from "react";
import CourseTable from "@/components/course/CourseTable";
import AddCourseModal from "@/components/course/AddCourseModal";
import ConfirmationModal from "@/components/e-library/ConfirmationModal";

const CourseManagementView = () => {
  const [courseList, setCourseList] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load real data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [coursesRes, teachersRes, departmentsRes] = await Promise.all([
          fetch("/api/courses"),
          fetch("/api/users?role=Teacher"),
          fetch("/api/departments"),
        ]);

        if (!coursesRes.ok) throw new Error("Failed to fetch courses");
        if (!teachersRes.ok) throw new Error("Failed to fetch teachers");
        if (!departmentsRes.ok) throw new Error("Failed to fetch departments");

        const coursesData = await coursesRes.json();
        const teachersData = await teachersRes.json();
        const departmentsData = await departmentsRes.json();

        setCourseList(coursesData);
        setTeachers(teachersData);
        setDepartments(departmentsData);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
      const res = await fetch(`/api/courses?id=${courseToDelete.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete course");
      }

      setCourseList(courseList.filter((c) => c.id !== courseToDelete.id));
      setCourseToDelete(null);
    } catch (err) {
      console.error("Failed to delete course:", err);
      setError(err.message);
    }
  };

  const handleSaveCourse = async (courseData) => {
    try {
      let res;

      if (editingCourse) {
        // Update existing course
        res = await fetch(`/api/courses?id=${editingCourse.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(courseData),
        });
      } else {
        // Add new course
        res = await fetch("/api/courses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(courseData),
        });
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }

      const savedCourse = await res.json();

      if (editingCourse) {
        setCourseList(
          courseList.map((c) => (c.id === savedCourse.id ? savedCourse : c))
        );
      } else {
        setCourseList([...courseList, savedCourse]);
      }

      handleCloseModal();
    } catch (err) {
      console.error("Failed to save course:", err);
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-slate-600">Loading courses...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Course Management</h1>
      <p className="text-slate-500">
        Add, edit, and manage all available courses in the system.
      </p>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

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
        teachers={teachers}
        departments={departments}
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
              <strong>{courseToDelete?.title}</strong>"?
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
