"use client";

import React, { useState, useEffect, useCallback } from "react";
import CourseTable from "./CourseTable";
import AddCourseModal from "./AddCourseModal";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import Notification from "@/components/Notification";

export default function CourseManagementView() {
  const [courseList, setCourseList] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [allGroups, setAllGroups] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "info",
  });

  const showMessage = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [coursesRes, teachersRes, departmentsRes, groupsRes] =
        await Promise.all([
          fetch("/api/courses"),
          fetch("/api/users?role=Teacher"),
          fetch("/api/departments"),
          fetch("/api/groups"),
        ]);

      if (!coursesRes.ok) throw new Error("Failed to fetch courses");
      if (!teachersRes.ok) throw new Error("Failed to fetch teachers");
      if (!departmentsRes.ok) throw new Error("Failed to fetch departments");
      if (!groupsRes.ok) throw new Error("Failed to fetch groups");

      setCourseList(await coursesRes.json());
      setTeachers(await teachersRes.json());
      setDepartments(await departmentsRes.json());
      setAllGroups(await groupsRes.json());
    } catch (err) {
      console.error("Failed to fetch data:", err);
      showMessage(err.message, "error");
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
      fetchData();
      setCourseToDelete(null);
      showMessage("Course deleted successfully!");
    } catch (err) {
      showMessage(err.message, "error");
    }
  };

  const handleCancelDelete = () => {
    setCourseToDelete(null);
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
      fetchData();
      handleCloseModal();
      showMessage(`Course ${editingCourse ? "updated" : "added"} successfully!`);
    } catch (err) {
      console.error("Failed to save course:", err);
      showMessage(err.message, "error");
    }
  };

  if (loading && courseList.length === 0) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Notification
        show={notification.show}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ ...notification, show: false })}
      />
      <h1 className="text-3xl font-bold text-slate-800">Course Management</h1>

      <CourseTable
        courses={courseList}
        onAddCourseClick={handleAddClick}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteRequest}
        isLoading={loading}
        departments={departments}
        teachers={teachers}
        allGroups={allGroups}
      />

      <AddCourseModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSaveCourse={handleSaveCourse}
        courseToEdit={editingCourse}
        teachers={teachers}
        departments={departments}
        allGroups={allGroups}
      />

      <ConfirmationDialog
        isOpen={!!courseToDelete}
        onClose={() => setCourseToDelete(null)}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        title="Delete Course"
        message={`Are you sure you want to delete "${courseToDelete?.title}"?`}
      />
    </div>
  );
}
