"use client";

import React, { useEffect, useState } from "react";
import AssignmentsTable from "./AssignmentsTable";

const StudentAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [activities, setActivities] = useState([]);
  const [groups, setGroups] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [activityTypes, setActivityTypes] = useState([]);

  const [formData, setFormData] = useState({
    departmentId: "",
    courseId: "",
    activityId: "",
    groupId: "",
    statusId: "",
    content: "",
    fileUrl: "",
    grade: "",
    feedback: "",
  });

  // --- Fetch functions ---
  const fetchActivityTypes = async () => {
    try {
      const res = await fetch("/api/activity");
      const data = await res.json();
      setActivityTypes(Array.isArray(data) ? data : []);
    } catch {
      setActivityTypes([]);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await fetch("/api/departments");
      const data = await res.json();
      setDepartments(Array.isArray(data) ? data : []);
    } catch {
      setDepartments([]);
    }
  };

  const fetchCoursesByDepartment = async (deptId) => {
    if (!deptId) return setCourses([]);
    try {
      const res = await fetch(`/api/courses?departmentId=${deptId}`);
      const data = await res.json();
      setCourses(Array.isArray(data) ? data : []);
    } catch {
      setCourses([]);
    }
  };

  const fetchActivitiesByCourse = async (courseId) => {
    if (!courseId) return setActivities([]);
    try {
      const res = await fetch(`/api/activity?courseId=${courseId}`);
      const data = await res.json();
      setActivities(Array.isArray(data) ? data : []);
    } catch {
      setActivities([]);
    }
  };

  const fetchGroupsByCourse = async (courseId) => {
    if (!courseId) return setGroups([]);
    try {
      const res = await fetch(`/api/groups?courseId=${courseId}`);
      const data = await res.json();
      setGroups(Array.isArray(data) ? data : []);
    } catch {
      setGroups([]);
    }
  };

  const fetchStatuses = async () => {
    try {
      const res = await fetch("/api/attendance-status");
      const data = await res.json();
      setStatuses(Array.isArray(data) ? data : []);
    } catch {
      setStatuses([]);
    }
  };

  const fetchAssignments = async () => {
    try {
      const res = await fetch("/api/studentAssignments");
      const data = await res.json();
      setAssignments(Array.isArray(data) ? data : []);
    } catch {
      setAssignments([]);
    }
  };

  // --- useEffect ---
  useEffect(() => {
    fetchDepartments();
    fetchStatuses();
    fetchActivityTypes();
    fetchAssignments();
  }, []);

  useEffect(() => {
    if (formData.departmentId) fetchCoursesByDepartment(formData.departmentId);
    else setCourses([]);
  }, [formData.departmentId]);

  useEffect(() => {
    if (formData.courseId) {
      fetchActivitiesByCourse(formData.courseId);
      fetchGroupsByCourse(formData.courseId);
    } else {
      setActivities([]);
      setGroups([]);
    }
  }, [formData.courseId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "departmentId" && {
        courseId: "",
        activityId: "",
        groupId: "",
      }),
      ...(name === "courseId" && {
        activityId: "",
        groupId: "",
      }),
    }));
  };

  const handleAddAssignment = async (e) => {
    e.preventDefault();

    if (!formData.activityId) return alert("Please select an activity.");
    if (!formData.statusId) return alert("Please select a status.");
    if (!formData.groupId) return alert("Please select a group.");

    const payload = {
      activityId: formData.activityId,
      groupId: formData.groupId,
      statusId: formData.statusId,
      submittedAt: new Date(),
      content: formData.content?.trim() || null,
      fileUrl: formData.fileUrl?.trim() || null,
      grade: formData.grade !== "" ? parseFloat(formData.grade) : null,
      feedback: formData.feedback?.trim() || null,
    };

    try {
      const res = await fetch("/api/studentAssignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to add assignment");
      }

      const newAssignment = await res.json();
      setAssignments((prev) => [newAssignment, ...prev]);
      setFormData({
        departmentId: "",
        courseId: "",
        activityId: "",
        groupId: "",
        statusId: "",
        content: "",
        fileUrl: "",
        grade: "",
        feedback: "",
      });

      alert("Assignment added successfully!");
    } catch (err) {
      console.error("Add Assignment Error:", err);
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this assignment?")) return;

    try {
      const res = await fetch(`/api/studentAssignments?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete assignment");

      setAssignments((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error("Delete Assignment Error:", err);
      alert(err.message);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Student Assignments</h1>

      <form
        onSubmit={handleAddAssignment}
        className="mb-6 p-4 bg-white shadow rounded space-y-4"
      >
        <h2 className="text-lg font-semibold">Add New Assignment</h2>

        {/* Department & Course */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            name="departmentId"
            value={formData.departmentId}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
            required
          >
            <option value="">Select Department</option>
            {departments.map((dept, idx) => (
              <option
                key={dept.id || dept._id || idx}
                value={dept.id || dept._id}
              >
                {dept.name}
              </option>
            ))}
          </select>

          <select
            name="courseId"
            value={formData.courseId}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
            required
            disabled={!formData.departmentId}
          >
            <option value="">Select Course</option>
            {courses.map((c, idx) => (
              <option key={c.id || c._id || idx} value={c.id || c._id}>
                {c.title || c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Activity & Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            name="activityId"
            value={formData.activityId}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
            required
            disabled={!formData.courseId || activities.length === 0}
          >
            <option value="">Select Activity</option>
            {activities.map((a, idx) => (
              <option key={a.id || a._id || idx} value={a.id || a._id}>
                {a.title || a.name}
              </option>
            ))}
          </select>

          <select
            name="statusId"
            value={formData.statusId}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
            required
          >
            <option value="">Select Status</option>
            {statuses.map((s, idx) => (
              <option key={s.id || s._id || idx} value={s.id || s._id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Group */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            name="groupId"
            value={formData.groupId}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
            required
            disabled={!formData.courseId || groups.length === 0}
          >
            <option value="">Select Group</option>
            {groups.map((g, idx) => (
              <option key={g.id || g._id || idx} value={g.id || g._id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

        {/* Content, File, Grade & Feedback */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="content"
            placeholder="Content"
            value={formData.content}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            name="fileUrl"
            placeholder="File URL"
            value={formData.fileUrl}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="number"
            name="grade"
            placeholder="Grade"
            value={formData.grade}
            onChange={handleInputChange}
            step="0.01"
            className="border p-2 rounded w-full"
          />
          <textarea
            name="feedback"
            placeholder="Feedback"
            value={formData.feedback}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
            rows={3}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Assignment
        </button>
      </form>

      <AssignmentsTable assignments={assignments} onDelete={handleDelete} />
    </div>
  );
};

export default StudentAssignments;
