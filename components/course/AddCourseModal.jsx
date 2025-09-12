// FILE: components/course/AddCourseModal.jsx

"use client";

import React, { useState, useEffect } from "react";
import GroupSelector from "@/components/course/GroupSelector"; // We can reuse the group selector

const initialFormState = {
  title: "",
  departmentId: "",
  instructorId: "",
  groupIds: [], // ✅ 1. Add groupIds to the form state
};

const AddCourseModal = ({
  isOpen,
  onClose,
  onSaveCourse,
  courseToEdit,
  teachers,
  departments,
  allGroups, // ✅ 2. Receive allGroups as a prop
}) => {
  const [formData, setFormData] = useState(initialFormState);
  const [error, setError] = useState("");
  const isEditMode = !!courseToEdit;

  useEffect(() => {
    if (isOpen) {
      if (courseToEdit) {
        setFormData({
          title: courseToEdit.title || "",
          departmentId: courseToEdit.departmentId || "",
          instructorId: courseToEdit.instructorId || "",
          // ✅ 3. Pre-fill the form with existing group associations
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
    /* ... validation logic ... */ return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSaveCourse(formData); // formData now includes groupIds
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ 4. Add a handler for the group selector
  const handleGroupSelectionChange = (groupIds) => {
    setFormData((prev) => ({ ...prev, groupIds }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <form onSubmit={handleSubmit} noValidate>
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">
              {isEditMode ? "Edit" : "Add"} Course
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium">Course Title</label>
              <input
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
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name}
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
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            {/* ✅ 5. Add the GroupSelector to the form */}
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
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
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
