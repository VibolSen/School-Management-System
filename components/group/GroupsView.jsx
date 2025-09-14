"use client";

import React, { useState, useEffect, useCallback } from "react";
import GroupTable from "./GroupTable";
import AddGroupModal from "./AddGroupModal";
import ConfirmationDialog from "@/components/ConfirmationDialog";

// Simple alert notification
const showMessage = (message, type = "success") => {
  alert(type === "success" ? `✅ ${message}` : `❌ ${message}`);
};

export default function GroupsView() {
  const [groups, setGroups] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [groupsRes, studentsRes] = await Promise.all([
        fetch("/api/groups"),
        fetch("/api/users?role=students"),
      ]);

      if (!groupsRes.ok) throw new Error("Failed to load groups.");
      if (!studentsRes.ok) throw new Error("Failed to load students.");

      const groupsData = await groupsRes.json();
      const studentsData = await studentsRes.json();

      setGroups(Array.isArray(groupsData) ? groupsData : []);
      setAllStudents(Array.isArray(studentsData) ? studentsData : []);
    } catch (err) {
      console.error(err);
      setError(err.message);
      showMessage(err.message, "error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddClick = () => {
    setEditingGroup(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (group) => {
    setEditingGroup(group);
    setIsModalOpen(true);
  };

  const handleDeleteRequest = (id) => {
    setItemToDelete(id);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/groups?id=${itemToDelete}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete group.");

      showMessage("Group deleted successfully!");
      fetchData();
      setItemToDelete(null);
    } catch (err) {
      console.error(err);
      showMessage(err.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setItemToDelete(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingGroup(null);
  };

  const handleSaveGroup = async (groupData) => {
    setIsLoading(true);
    try {
      const res = await fetch(
        editingGroup ? `/api/groups?id=${editingGroup.id}` : "/api/groups",
        {
          method: editingGroup ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(groupData),
        }
      );

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || `HTTP error ${res.status}`);
      }

      showMessage(`Group ${editingGroup ? "updated" : "added"} successfully!`);
      fetchData();
    } catch (err) {
      console.error(err);
      showMessage(`Failed to save group: ${err.message}`, "error");
    } finally {
      setIsLoading(false);
      handleCloseModal();
    }
  };

  if (isLoading && groups.length === 0) {
    return <p className="text-center py-10">Loading group data...</p>;
  }

  if (error) {
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
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Group Management</h1>

      <GroupTable
        groups={groups}
        onAddGroupClick={handleAddClick}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteRequest}
        isLoading={isLoading}
      />

      {isModalOpen && (
        <AddGroupModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveGroup}
          groupToEdit={editingGroup}
          allStudents={allStudents}
          isLoading={isLoading}
        />
      )}
      {itemToDelete && (
        <ConfirmationDialog
          isOpen={!!itemToDelete}
          onClose={() => setItemToDelete(null)}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          title="Delete Group"
          message="Are you sure you want to delete this group?"
        />
      )}
    </div>
  );
}