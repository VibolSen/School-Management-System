"use client";

import React, { useState, useEffect, useCallback } from "react";
import CourseTable from "@/components/course/CourseTable";
import AddCourseModal from "@/components/course/AddCourseModal";
import ConfirmationModal from "@/components/ConfirmationModal";

const CourseManagementView = () => {
  const [courseList, setCourseList] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [allGroups, setAllGroups] = useState([]); // ✅ Add state for groups
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const [coursesRes, teachersRes, departmentsRes, groupsRes] =
        await Promise.all([
          fetch("/api/courses"),
          fetch("/api/users?role=Teacher"),
          fetch("/api/departments"),
          fetch("/api/groups"), // ✅ Fetch all groups
        ]);

      if (!coursesRes.ok) throw new Error("Failed to fetch courses");
      if (!teachersRes.ok) throw new Error("Failed to fetch teachers");
      if (!departmentsRes.ok) throw new Error("Failed to fetch departments");
      if (!groupsRes.ok) throw new Error("Failed to fetch groups"); // ✅ Handle group fetch error

      setCourseList(await coursesRes.json());
      setTeachers(await teachersRes.json());
      setDepartments(await departmentsRes.json());
      setAllGroups(await groupsRes.json()); // ✅ Set groups state
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
      if (!res.ok) throw new Error("Failed to delete course");
      fetchData(); // Refresh list from server
      setCourseToDelete(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSaveCourse = async (courseData) => {
    try {
      const url = editingCourse
        ? `/api/courses?id=${editingCourse.id}`
        : "/api/courses";
      const method = editingCourse ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(courseData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save course");
      }

      fetchData(); // Re-fetch all data to ensure consistency
      handleCloseModal();
    } catch (err) {
      console.error("Failed to save course:", err);
      setError(err.message);
    }
  };

  // ... rest of the component is the same

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Course Management</h1>
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>
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
        allGroups={allGroups} // ✅ Pass groups to the modal
      />

      <ConfirmationModal
        isOpen={!!courseToDelete}
        onClose={() => setCourseToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Course"
        message={`Are you sure you want to delete "${courseToDelete?.title}"?`}
      />
    </div>
  );
};

export default CourseManagementView;
