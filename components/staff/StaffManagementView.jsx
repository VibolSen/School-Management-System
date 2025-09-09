"use client";

import React, { useState, useEffect, useCallback } from "react";
import StaffTable from "./StaffTable";
import AddStaffModal from "./AddStaffModal";

// Simple alert notification
const showMessage = (message, type = "success") => {
  alert(type === "success" ? `✅ ${message}` : `❌ ${message}`);
};

export default function StaffManagementView() {
  const [staffList, setStaffList] = useState([]);
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch staff
  const fetchStaff = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();

      // ✅ Filter out users with role.name === "Students"
      const staffOnly = data.filter(
        (user) => user.role?.name?.toLowerCase() !== "students"
      );

      setStaffList(staffOnly);
    } catch (err) {
      console.error(err);
      setError("Failed to load staff data.");
      showMessage("Failed to load staff data.", "error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch roles from API
  const fetchRoles = useCallback(async () => {
    try {
      const res = await fetch("/api/roles");
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();

      // ✅ Remove Students from role list
      const staffRoles = data.filter(
        (role) => role.name?.toLowerCase() !== "students"
      );

      setRoles(staffRoles);
    } catch (err) {
      console.error(err);

      // Fallback roles (no Students)
      setRoles([
        { id: "admin", name: "Admin" },
        { id: "faculty", name: "Faculty" },
        { id: "hr", name: "HR" },
        { id: "teacher", name: "Teacher" },
      ]);
    }
  }, []);


  // Fetch departments dynamically
  const fetchDepartments = useCallback(async () => {
    try {
      const res = await fetch("/api/departments");
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      setDepartments(data);
    } catch (err) {
      console.error(err);
      showMessage("Failed to load departments", "error");
    }
  }, []);

  useEffect(() => {
    fetchStaff();
    fetchRoles();
    fetchDepartments();
  }, [fetchStaff, fetchRoles, fetchDepartments]);

  const handleAddClick = () => {
    setEditingStaff(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (staff) => {
    setEditingStaff(staff);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm("Are you sure you want to delete this staff member?"))
      return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/users?id=${id}`, { method: "DELETE" });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || `HTTP error ${res.status}`);
      }
      setStaffList((prev) => prev.filter((s) => s.id !== id));
      showMessage("Staff member deleted successfully!");
    } catch (err) {
      console.error(err);
      showMessage(`Failed to delete staff: ${err.message}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/users?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || `HTTP error ${res.status}`);
      }
      setStaffList((prev) =>
        prev.map((staff) =>
          staff.id === id ? { ...staff, isActive: !currentStatus } : staff
        )
      );
      showMessage(
        `Staff member ${
          !currentStatus ? "activated" : "deactivated"
        } successfully!`
      );
    } catch (err) {
      console.error(err);
      showMessage(`Failed to update status: ${err.message}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStaff(null);
  };

  const handleSaveStaff = async (staffData) => {
    setIsLoading(true);
    try {
      const dataToSend = {
        name: staffData.name,
        email: staffData.email,
        contactNumber: staffData.contactNumber,
        department: staffData.department,
        isActive: staffData.isActive,
        roleId: staffData.roleId,
      };

      // Add password for new staff
      if (!editingStaff) dataToSend.password = staffData.password;

      const res = await fetch(
        editingStaff ? `/api/users?id=${editingStaff.id}` : "/api/users",
        {
          method: editingStaff ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSend),
        }
      );

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || `HTTP error ${res.status}`);
      }

      showMessage(
        `Staff member ${editingStaff ? "updated" : "added"} successfully!`
      );
      fetchStaff(); // Refresh the list
    } catch (err) {
      console.error(err);
      showMessage(`Failed to save staff: ${err.message}`, "error");
    } finally {
      setIsLoading(false);
      handleCloseModal();
    }
  };


  if (isLoading && staffList.length === 0) {
    return <p className="text-center py-10">Loading staff data...</p>;
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-600">
        <p>{error}</p>
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
      {/* Main header without Add Staff button */}
      <h1 className="text-3xl font-bold text-slate-800">Staff Management</h1>

      <StaffTable
        staffList={staffList}
        allRoles={roles}
        onAddStaffClick={handleAddClick}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
        onToggleStatus={handleToggleStatus}
        isLoading={isLoading}
      />

      {isModalOpen && (
        <AddStaffModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveStaff}
          staffToEdit={editingStaff}
          roles={roles}
          departments={departments}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
