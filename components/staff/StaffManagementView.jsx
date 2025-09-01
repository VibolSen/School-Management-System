"use client";

import React, { useState } from "react";
import StaffTable from "./StaffTable";
import AddStaffModal from "./AddStaffModal";

export default function StaffManagementView({ initialStaff = [] }) {
  const [staffList, setStaffList] = useState(initialStaff);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  const handleAddClick = () => {
    setEditingStaff(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (staffMember) => {
    setEditingStaff(staffMember);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStaff(null);
  };

  const handleSaveStaff = (staffData) => {
    if (editingStaff) {
      // Update existing staff
      const updatedStaffMember = { ...editingStaff, ...staffData };
      setStaffList(
        staffList.map((s) =>
          s.id === editingStaff.id ? updatedStaffMember : s
        )
      );
    } else {
      // Add new staff
      const newStaffMember = {
        id: `S${(staffList.length + 1).toString().padStart(3, "0")}`,
        ...staffData,
      };
      setStaffList((prevList) =>
        [...prevList, newStaffMember].sort((a, b) =>
          a.name.localeCompare(b.name)
        )
      );
    }
    handleCloseModal();
  };

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
