// StudentAssignmentModal.jsx
"use client";

import React, { useState, useEffect } from "react";

export default function StudentAssignmentModal({
  isOpen,
  onClose,
  onSave,
  assignmentToEdit,
  isLoading = false,
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    departmentId: "", // Helper state, not in final payload
    courseId: "",
    activityId: "",
    studentId: "", // Assuming you need to select a student
    groupId: "",
    statusId: "",
    content: "",
    fileUrl: "",
    grade: "",
    feedback: "",
  });

  // State for dropdown options
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [activities, setActivities] = useState([]);
  const [groups, setGroups] = useState([]);
  const [statuses, setStatuses] = useState([]);

  // --- Fetch data for dropdowns ---
  useEffect(() => {
    const fetchData = async () => {
      // Fetch departments, statuses, etc.
      const deptRes = await fetch("/api/departments");
      setDepartments(await deptRes.json());
      const statusRes = await fetch("/api/attendance-status");
      setStatuses(await statusRes.json());
    };
    fetchData();
  }, []);

  // --- Populate form if editing ---
  useEffect(() => {
    if (assignmentToEdit) {
      const assignment = assignmentToEdit.assignment || {};
      const course = assignment.course || {};
      setFormData({
        title: assignment.title || "",
        description: assignment.description || "",
        dueDate: assignment.dueDate
          ? new Date(assignment.dueDate).toISOString().slice(0, 16)
          : "",
        departmentId: course.departmentId || "",
        courseId: assignment.courseId || "",
        activityId: assignment.activityId || "",
        studentId: assignmentToEdit.studentId || "",
        groupId: assignmentToEdit.groupAssignment?.groupId || "",
        statusId: assignmentToEdit.statusId || "",
        content: assignmentToEdit.content || "",
        fileUrl: assignmentToEdit.fileUrl || "",
        grade: assignmentToEdit.grade ?? "",
        feedback: assignmentToEdit.feedback || "",
      });
    }
  }, [assignmentToEdit]);

  // --- Dynamic fetching for dependent dropdowns ---
  useEffect(() => {
    const fetchDependentData = async () => {
      if (formData.departmentId) {
        const coursesRes = await fetch(
          `/api/courses?departmentId=${formData.departmentId}`
        );
        setCourses(await coursesRes.json());
      } else {
        setCourses([]);
      }
    };
    fetchDependentData();
  }, [formData.departmentId]);

  useEffect(() => {
    const fetchDependentData = async () => {
      if (formData.courseId) {
        const activitiesRes = await fetch(
          `/api/activity?courseId=${formData.courseId}`
        );
        setActivities(await activitiesRes.json());
        const groupsRes = await fetch(
          `/api/groups?courseId=${formData.courseId}`
        );
        setGroups(await groupsRes.json());
      } else {
        setActivities([]);
        setGroups([]);
      }
    };
    fetchDependentData();
  }, [formData.courseId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // Reset dependent fields when a parent changes
      ...(name === "departmentId" && {
        courseId: "",
        activityId: "",
        groupId: "",
      }),
      ...(name === "courseId" && { activityId: "", groupId: "" }),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Remove the helper `departmentId` before saving
    const { departmentId, ...payload } = formData;
    onSave(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-slate-800">
            {assignmentToEdit ? "Edit Assignment" : "Add New Assignment"}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title, Description, Due Date */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Title"
              required
              className="border p-2 rounded w-full"
            />
            <input
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              className="border p-2 rounded w-full"
            />
            <input
              type="datetime-local"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>

          {/* Department & Course */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              name="departmentId"
              value={formData.departmentId}
              onChange={handleChange}
              required
              className="border p-2 rounded w-full"
            >
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            <select
              name="courseId"
              value={formData.courseId}
              onChange={handleChange}
              required
              disabled={!formData.departmentId}
              className="border p-2 rounded w-full"
            >
              <option value="">Select Course</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          {/* Activity, Group, Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              name="activityId"
              value={formData.activityId}
              onChange={handleChange}
              required
              disabled={!formData.courseId}
              className="border p-2 rounded w-full"
            >
              <option value="">Select Activity</option>
              {activities.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.title}
                </option>
              ))}
            </select>
            <select
              name="groupId"
              value={formData.groupId}
              onChange={handleChange}
              disabled={!formData.courseId}
              className="border p-2 rounded w-full"
            >
              <option value="">Select Group (Optional)</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
            <select
              name="statusId"
              value={formData.statusId}
              onChange={handleChange}
              required
              className="border p-2 rounded w-full"
            >
              <option value="">Select Status</option>
              {statuses.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Other fields like content, grade etc. */}

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {isLoading ? "Saving..." : "Save Assignment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
