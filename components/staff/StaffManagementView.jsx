"use client";

import React, { useState, useEffect, useCallback } from "react";
import StaffTable from "./StaffTable";
import AddStaffModal from "./AddStaffModal";

// Simple alert-based notification system
const showMessage = (message, type = "success") => {
  if (type === "success") {
    alert(`✅ ${message}`);
  } else {
    alert(`❌ ${message}`);
  }
};

export default function StaffManagementView() {
  const [staffList, setStaffList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStaff = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/staff");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setStaffList(data);
    } catch (err) {
      console.error("Failed to fetch staff:", err);
      setError("Failed to load staff data.");
      showMessage("Failed to load staff data.", "error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const handleAddClick = () => {
    setEditingStaff(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (staffMember) => {
    setEditingStaff(staffMember);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (staffId) => {
    if (!window.confirm("Are you sure you want to delete this staff member?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/staff/${staffId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      setStaffList((prevList) => prevList.filter((s) => s.id !== staffId));
      showMessage("Staff member deleted successfully!");
    } catch (err) {
      console.error("Failed to delete staff:", err);
      showMessage(`Failed to delete staff: ${err.message}`, "error");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStaff(null);
  };

  const handleSaveStaff = async (staffData) => {
    try {
      let response;
      if (editingStaff) {
        response = await fetch(`/api/admin/staff/${editingStaff.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(staffData),
        });
      } else {
        response = await fetch("/api/admin/staff", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(staffData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      showMessage(
        `Staff member ${editingStaff ? "updated" : "added"} successfully!`
      );
      fetchStaff();
    } catch (err) {
      console.error("Failed to save staff:", err);
      showMessage(`Failed to save staff: ${err.message}`, "error");
    } finally {
      handleCloseModal();
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <p className="text-xl text-slate-600">Loading staff data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-600">
        <p className="text-xl">{error}</p>
        <button
          onClick={fetchStaff}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Staff Management</h1>
      <p className="text-slate-500">
        View, edit, and manage all staff members in the system.
      </p>
      <StaffTable
        staff={staffList}
        onAddStaffClick={handleAddClick}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
      />
      <AddStaffModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSaveStaff={handleSaveStaff}
        staffToEdit={editingStaff}
      />
    </div>
  );
}
