"use client";

import React, { useState, useEffect } from "react";
import StudentSelector from "./StudentSelector";

export default function AddGroupModal({
  isOpen,
  onClose,
  onSave,
  groupToEdit,
  allStudents,
  isLoading = false,
}) {
  const [name, setName] = useState("");
  const [studentIds, setStudentIds] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (groupToEdit) {
        setName(groupToEdit.name || "");
        setStudentIds(groupToEdit.members.map((m) => m.student.id) || []);
      } else {
        setName("");
        setStudentIds([]);
      }
      setError("");
    }
  }, [isOpen, groupToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Group name is required.");
      return;
    }
    onSave({ name, studentIds });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">
            {groupToEdit ? "Edit Group" : "Add New Group"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800"
            disabled={isLoading}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Group Name *
            </label>
            <input
              type="text"
              name="name"
              placeholder="Group Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                error ? "border-red-500" : "border-slate-300"
              }`}
              required
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>

          <StudentSelector
            allStudents={allStudents}
            selectedStudentIds={studentIds}
            setSelectedStudentIds={setStudentIds}
          />

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-semibold text-slate-700 hover:bg-slate-100"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading
                ? "Saving..."
                : groupToEdit
                ? "Update Group"
                : "Add Group"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
