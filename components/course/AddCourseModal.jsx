"use client";

import React, { useState, useEffect, useRef } from "react";
import GroupSelector from "@/components/course/GroupSelector"; // ✅ Import the new component

const initialFormState = {
  title: "",
  departmentId: "",
  instructorId: "",
  groupIds: [], // ✅ Add groupIds to state
};

const AddCourseModal = ({
  isOpen,
  onClose,
  onSaveCourse,
  courseToEdit,
  teachers,
  departments,
  allGroups, // ✅ Pass in all available groups
}) => {
  const [formData, setFormData] = useState(initialFormState);
  const [error, setError] = useState("");
  const inputRef = useRef(null);
  const isEditMode = !!courseToEdit;

  useEffect(() => {
    if (isOpen) {
      if (courseToEdit) {
        setFormData({
          title: courseToEdit.title || "",
          departmentId: courseToEdit.departmentId || "",
          instructorId: courseToEdit.instructorId || "",
          groupIds: courseToEdit.groups
            ? courseToEdit.groups.map((g) => g.id)
            : [],
        });
      } else {
        setFormData(initialFormState);
      }
      setError("");
    }
  }, [isOpen, courseToEdit]);

  const validate = () => {
    if (!formData.title.trim()) {
      setError("Course title is required.");
      return false;
    }
    if (!formData.instructorId) {
      setError("Please select an instructor.");
      return false;
    }
    if (!formData.departmentId) {
      setError("Please select a department.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSaveCourse(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGroupSelectionChange = (groupIds) => {
    setFormData((prev) => ({ ...prev, groupIds }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">
            {isEditMode ? "Edit Course" : "Add New Course"}
          </h2>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <div className="p-6 space-y-4">
            {/* Title, Instructor, Department fields remain the same */}
            <div>
              <label className="block text-sm font-medium">Course Title</label>
              <input
                ref={inputRef}
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Instructor</label>
              <select
                name="instructorId"
                value={formData.instructorId}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                <option value="">Select an instructor</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Department</label>
              <select
                name="departmentId"
                value={formData.departmentId}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                <option value="">Select a department</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* ✅ ADD Group Selector */}
            <div>
              <label className="block text-sm font-medium">
                Assign Groups (Optional)
              </label>
              <GroupSelector
                allGroups={allGroups}
                selectedGroupIds={formData.groupIds}
                setSelectedGroupIds={handleGroupSelectionChange}
              />
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
          <div className="p-6 bg-slate-50 border-t flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              {isEditMode ? "Save Changes" : "Save Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCourseModal;
