"use client";

import React, { useState, useEffect, useCallback } from "react";
import AddStudentModal from "./AddStudentModal";
import StudentTable from "./StudentTable";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import Notification from "@/components/Notification";

export default function StudentManagementView() {
  const [students, setStudents] = useState([]);
  const [roles, setRoles] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
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
    setIsLoading(true);
    setError(null);
    try {
      // 1. Fetch all users
      const resUsers = await fetch("/api/users");
      if (!resUsers.ok)
        throw new Error(`HTTP error! status: ${resUsers.status}`);
      const users = await resUsers.json();

      // 2. Fetch roles
      const resRoles = await fetch("/api/roles");
      if (!resRoles.ok)
        throw new Error(`HTTP error! status: ${resRoles.status}`);
      const rolesData = await resRoles.json();
      setRoles(rolesData);

      // 🔑 Find the "Students" role ID
      const studentRole = rolesData.find(
        (role) => role.name?.toLowerCase() === "students"
      );

      // 3. Fetch courses
      const resCourses = await fetch("/api/courses");
      if (!resCourses.ok)
        throw new Error(`HTTP error! status: ${resCourses.status}`);
      setCourses(await resCourses.json());

      // 4. Filter only students
      const studentsOnly = users
        .filter((user) => user.roleId === studentRole?.id) // ✅ compare with actual ID
        .map((user) => {
          const role = rolesData.find((r) => r.id === user.roleId) || {
            name: "N/A",
          };
          return { ...user, role };
        });

      setStudents(studentsOnly);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError("Failed to load data.");
      showMessage("Failed to load data.", "error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddClick = () => {
    setEditingStudent(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (student) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  const handleDeleteRequest = (id) => {
    setItemToDelete(id);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      const res = await fetch(`/api/users?id=${itemToDelete}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || `HTTP error! status: ${res.status}`);
      }
      setStudents((prev) => prev.filter((s) => s.id !== itemToDelete));
      showMessage("Student deleted successfully!");
      setItemToDelete(null);
    } catch (err) {
      console.error("Failed to delete student:", err);
      showMessage(`Failed to delete student: ${err.message}`, "error");
    }
  };

  const handleCancelDelete = () => {
    setItemToDelete(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
  };

  const handleSaveStudent = async (studentData) => {
    try {
      // Build payload carefully
      const apiData = {
        name: studentData.name,
        email: studentData.email,
        isActive: studentData.isActive, // Pass active status
        enrollmentDate: studentData.enrollmentDate, // Pass enrollment date
      };

      if (!editingStudent && studentData.password) {
        apiData.password = studentData.password;
      }

      // Find the student role ID to assign it automatically
      const studentRole = roles.find(
        (role) => role.name?.toLowerCase() === "students"
      );
      if (studentRole) {
        apiData.roleId = studentRole.id;
      } else if (!editingStudent) {
        console.error("Student role not found. Cannot create new student.");
        showMessage("Error: 'Students' role not found.", "error");
        return;
      }

      // Only send courseIds if they exist
      if (studentData.courseIds?.length) {
        apiData.courseIds = studentData.courseIds;
      }

      let res;
      if (editingStudent) {
        res = await fetch(`/api/users?id=${editingStudent.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(apiData),
        });
      } else {
        res = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(apiData),
        });
      }

      const contentType = res.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        // Handle cases where the response might not be JSON (e.g., empty response on success)
        if (res.ok) {
          data = {}; // Assume success if response is ok but not JSON
        } else {
          throw new Error(
            `Expected JSON, but got ${res.status} ${res.statusText}`
          );
        }
      }

      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);

      showMessage(
        `Student ${editingStudent ? "updated" : "added"} successfully!`
      );
      fetchData(); // Refresh data
    } catch (err) {
      console.error("Failed to save student:", err);
      showMessage(`Failed to save student: ${err.message}`, "error");
    } finally {
      handleCloseModal();
    }
  };

  if (isLoading)
    return <p className="text-center py-10">Loading student data...</p>;
  if (error)
    return (
      <div className="text-center py-10 text-red-600">
        <p>{error}</p>
        <button
          onClick={fetchData}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );

  return (
    <div className="space-y-6">
      <Notification
        show={notification.show}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ ...notification, show: false })}
      />
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">
          Student Management
        </h1>
      </div>

      <StudentTable
        students={students}
        allCourses={courses}
        onAddStudentClick={handleAddClick}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteRequest}
      />

      {isModalOpen && (
        <AddStudentModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSaveStudent={handleSaveStudent}
          studentToEdit={editingStudent}
          allCourses={courses}
        />
      )}
      {itemToDelete && (
        <ConfirmationDialog
          isOpen={!!itemToDelete}
          onClose={() => setItemToDelete(null)}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          title="Delete Student"
          message="Are you sure you want to delete this student?"
        />
      )}
    </div>
  );
}