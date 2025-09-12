// FILE: components/assignment/StudentAssignmentsView.jsx

"use client";

import React, { useState, useEffect, useCallback } from "react";
import AssignmentsTable from "./AssignmentsTable";
import StudentAssignmentModal from "./StudentAssignmentModal";
import Notification from "@/components/Notification"; // Assuming a notification component

export default function StudentAssignmentView() {
  const [assignments, setAssignments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  const showMessage = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "" }),
      3000
    );
  };

  const fetchAssignments = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/assignments");
      if (!res.ok) throw new Error("Failed to load assignments.");
      const data = await res.json();
      setAssignments(Array.isArray(data) ? data : []);
    } catch (err) {
      showMessage(err.message, "error");
      setAssignments([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const handleAddClick = () => {
    setEditingAssignment(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (assignment) => {
    setEditingAssignment(assignment);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id) => {
    if (
      !window.confirm(
        "This will delete the assignment for all students in the group. Are you sure?"
      )
    )
      return;
    try {
      const res = await fetch(`/api/assignments?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({})); // Handle empty error responses
        throw new Error(errData.error || "Failed to delete assignment");
      }
      showMessage("Assignment deleted for all students successfully!");
      fetchAssignments(); // Refresh the list
    } catch (err) {
      showMessage(err.message, "error");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAssignment(null);
  };

  const handleSaveAssignment = async (formData) => {
    try {
      const url = editingAssignment
        ? `/api/assignments?id=${editingAssignment.id}`
        : "/api/assignments";
      const method = editingAssignment ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save assignment");
      }

      showMessage(
        `Assignment ${
          editingAssignment ? "details updated" : "created"
        } successfully!`
      );
      fetchAssignments();
    } catch (err) {
      showMessage(err.message, "error");
    } finally {
      handleCloseModal();
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <Notification
        show={notification.show}
        message={notification.message}
        type={notification.type}
      />
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Assignments</h1>
        <p className="text-slate-500 mt-1">
          Manage all student and group assignments.
        </p>
      </div>
      <AssignmentsTable
        assignments={assignments}
        onAddClick={handleAddClick}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
        isLoading={isLoading}
      />
      {isModalOpen && (
        <StudentAssignmentModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveAssignment}
          assignmentToEdit={editingAssignment}
        />
      )}
    </div>
  );
}
