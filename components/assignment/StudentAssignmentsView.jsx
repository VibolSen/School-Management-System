// StudentAssignmentView.jsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import AssignmentsTable from "./AssignmentsTable";
import StudentAssignmentModal from "./StudentAssignmentModal";
import Notification from "@/components/Notification"; // Assuming you have a Notification component

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

  // --- Utility Functions ---
  const showMessage = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "" }),
      3000
    );
  };

  // --- API Calls ---
  const fetchAssignments = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/assignments");
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setAssignments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching assignments:", err);
      showMessage("Failed to load assignments.", "error");
      setAssignments([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  // --- Event Handlers ---
  const handleAddClick = () => {
    setEditingAssignment(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (assignment) => {
    setEditingAssignment(assignment);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm("Are you sure you want to delete this assignment?"))
      return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/assignments?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to delete assignment");
      }
      setAssignments((prev) => prev.filter((a) => a.id !== id));
      showMessage("Assignment deleted successfully!");
    } catch (err) {
      console.error("Delete Assignment Error:", err);
      showMessage(err.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAssignment(null);
  };

  const handleSaveAssignment = async (formData) => {
    setIsLoading(true);
    try {
      let res;
      if (editingAssignment) {
        // This is an update (PUT)
        res = await fetch(`/api/assignments?id=${editingAssignment.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        // This is a creation (POST)
        res = await fetch("/api/assignments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save assignment");
      }

      showMessage(
        `Assignment ${editingAssignment ? "updated" : "added"} successfully!`
      );
      fetchAssignments(); // Re-fetch all assignments to get the latest data
    } catch (err) {
      console.error("Save Assignment Error:", err);
      showMessage(err.message, "error");
    } finally {
      setIsLoading(false);
      handleCloseModal();
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <Notification
        show={notification.show}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ show: false, message: "", type: "" })}
      />

      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Assignments
        </h1>
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
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
