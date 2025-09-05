"use client";

import React, { useState, useEffect, useCallback } from "react"; // <--- ADD THIS LINE
import AddStudentModal from "./AddStudentModal";

// Simple alert-based notification system
const showMessage = (message, type = "success") => {
  if (type === "success") {
    alert(`✅ ${message}`);
  } else {
    alert(`❌ ${message}`);
  }
};

export default function StudentManagementView() {
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roles, setRoles] = useState([]); // State to store roles
  const [studentStatuses, setStudentStatuses] = useState([]); // State to store student statuses
  const [courses, setCourses] = useState([]); // State to store courses

  // Fetch all necessary data
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch students
      const studentsResponse = await fetch("/api/admin/users?role=student");
      if (!studentsResponse.ok) {
        throw new Error(`HTTP error! status: ${studentsResponse.status}`);
      }
      const studentsData = await studentsResponse.json();
      setStudents(studentsData);

      // Fetch roles (if needed for selection in modal, though 'student' is hardcoded here)
      const rolesResponse = await fetch("/api/admin/roles"); // Assuming an API endpoint for roles
      if (!rolesResponse.ok) {
        throw new Error(`HTTP error! status: ${rolesResponse.status}`);
      }
      const rolesData = await rolesResponse.json();
      setRoles(rolesData);

      // Fetch student statuses
      const studentStatusesResponse = await fetch(
        "/api/admin/student-statuses"
      ); // Assuming an API endpoint for student statuses
      if (!studentStatusesResponse.ok) {
        throw new Error(
          `HTTP error! status: ${studentStatusesResponse.status}`
        );
      }
      const studentStatusesData = await studentStatusesResponse.json();
      setStudentStatuses(studentStatusesData);

      // Fetch courses
      const coursesResponse = await fetch("/api/admin/courses"); // Assuming an API endpoint for courses
      if (!coursesResponse.ok) {
        throw new Error(`HTTP error! status: ${coursesResponse.status}`);
      }
      const coursesData = await coursesResponse.json();
      setCourses(coursesData);
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
    if (!window.confirm("Are you sure you want to delete this student?"))
      return;

    try {
      const response = await fetch(`/api/admin/users/${studentId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      setStudents((prev) => prev.filter((s) => s.id !== studentId));
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
      let response;
      // Find the student role ID
      const studentRole = roles.find((role) => role.name === "student");
      if (!studentRole) {
        throw new Error(
          "Student role not found. Please ensure it exists in your database."
        );
      }

      // Find the ID for the selected student status
      const selectedStatus = studentStatuses.find(
        (status) => status.name === studentData.status
      );
      if (!selectedStatus) {
        throw new Error(`Student status '${studentData.status}' not found.`);
      }

      // Prepare data for API
      const apiData = {
        ...studentData,
        roleId: studentRole.id, // Assign the actual UUID for the 'student' role
        studentStatusId: selectedStatus.id, // Assign the actual UUID for the student status
        courseIds: studentData.courseIds, // Send only course IDs, already correctly named from modal
      };

      // Remove the 'status' property that was for local use in the modal
      delete apiData.status;

      if (editingStudent) {
        response = await fetch(`/api/admin/users/${editingStudent.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(apiData),
        });
      } else {
        response = await fetch("/api/admin/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(apiData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      showMessage(
        `Student ${editingStudent ? "updated" : "added"} successfully!`
      );
      fetchData(); // Refresh data after save
    } catch (err) {
      console.error("Failed to save student:", err);
      showMessage(`Failed to save student: ${err.message}`, "error");
    } finally {
      handleCloseModal();
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <p className="text-xl text-slate-600">Loading student data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-600">
        <p className="text-xl">{error}</p>
        <button
          onClick={fetchData} // Call fetchData to retry all fetches
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">
          Student Management
        </h1>
        <button
          onClick={handleAddClick}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add New Student
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Overall Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student) => (
              <tr key={student.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {student.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {student.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      // Display the overall student status
                      student.status === "Enrolled"
                        ? "bg-blue-100 text-blue-800"
                        : student.status === "Graduated"
                        ? "bg-green-100 text-green-800"
                        : student.status === "Withdrawn"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {student.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(student.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleEditClick(student)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(student.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {students.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No students found.</p>
          </div>
        )}
      </div>

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
