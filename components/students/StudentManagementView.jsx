"use client";

import React, { useState, useEffect, useCallback } from "react";
import AddStudentModal from "./AddStudentModal";
import StudentTable from "./StudentTable";

const showMessage = (message, type = "success") => {
  alert(type === "success" ? `✅ ${message}` : `❌ ${message}`);
};

export default function StudentManagementView() {
  const [students, setStudents] = useState([]);
  const [roles, setRoles] = useState([]);
  const [studentStatuses, setStudentStatuses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Fetch all users
      const resUsers = await fetch("/api/users");
      if (!resUsers.ok) throw new Error(`HTTP error! status: ${resUsers.status}`);
      const users = await resUsers.json();

      // 2. Fetch roles
      const resRoles = await fetch("/api/admin/roles");
      if (!resRoles.ok) throw new Error(`HTTP error! status: ${resRoles.status}`);
      const rolesData = await resRoles.json();
      setRoles(rolesData);

      // 3. Fetch student statuses
      const resStatuses = await fetch("/api/admin/student-statuses");
      if (!resStatuses.ok) throw new Error(`HTTP error! status: ${resStatuses.status}`);
      setStudentStatuses(await resStatuses.json());

      // 4. Fetch courses
      const resCourses = await fetch("/api/admin/courses");
      if (!resCourses.ok) throw new Error(`HTTP error! status: ${resCourses.status}`);
      setCourses(await resCourses.json());

      // 5. Filter students and attach role object
      const studentsOnly = users
        .filter(user => user.roleId === "students") // or your student role ID
        .map(user => {
          const role = rolesData.find(r => r.id === user.roleId) || { name: "N/A" };
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

  const handleDeleteClick = async (studentId) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
  
    try {
      const res = await fetch(`/api/users?id=${studentId}`, { method: "DELETE" });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || `HTTP error! status: ${res.status}`);
      }
      setStudents(prev => prev.filter(s => s.id !== studentId));
      showMessage("Student deleted successfully!");
    } catch (err) {
      console.error("Failed to delete student:", err);
      showMessage(`Failed to delete student: ${err.message}`, "error");
    }
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
      };
  
      if (!editingStudent && studentData.password) {
        apiData.password = studentData.password;
      }
  
      if (studentData.roleId) {
        apiData.roleId = studentData.roleId; // "students"
      }
  
      if (studentData.studentStatusId) {
        apiData.studentStatusId = studentData.studentStatusId;
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
        throw new Error(`Expected JSON, but got ${res.status} ${res.statusText}`);
      }
  
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
  
      showMessage(`Student ${editingStudent ? "updated" : "added"} successfully!`);
      fetchData();
    } catch (err) {
      console.error("Failed to save student:", err);
      showMessage(`Failed to save student: ${err.message}`, "error");
    } finally {
      handleCloseModal();
    }
  };
  

  if (isLoading) return <p className="text-center py-10">Loading student data...</p>;
  if (error) return (
    <div className="text-center py-10 text-red-600">
      <p>{error}</p>
      <button onClick={fetchData} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Retry
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">Student Management</h1>
      </div>

      <StudentTable
        students={students}
        allCourses={courses}
        onAddStudentClick={handleAddClick}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
      />

      {isModalOpen && (
        <AddStudentModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSaveStudent={handleSaveStudent}
          studentToEdit={editingStudent}
          allCourses={courses}
          allStudentStatuses={studentStatuses}
        />
      )}
    </div>
  );
}
