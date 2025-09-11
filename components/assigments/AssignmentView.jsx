"use client";

import React, { useState, useEffect, useMemo } from "react";
import AssignmentsTable from "@/components/AssignmentsTable";
import { useUser } from "@/context/UserContext";

const AssignmentView = () => {
  const { user } = useUser();
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await fetch("/api/assignments");
        if (!res.ok) {
          throw new Error("Failed to fetch assignments");
        }
        const data = await res.json();
        setAssignments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch assignments:", err);
      }
    };

    fetchAssignments();
  }, []);

  const studentAssignments = useMemo(() => {
    if (!user || !assignments) return [];
    return assignments.filter((a) => a.studentId === user.id);
  }, [user, assignments]);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/assignments?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete assignment");
      }

      setAssignments((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      console.error("Failed to delete assignment:", error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">My Assignments</h1>
      <p className="text-slate-500">
        Here are the assignments for your courses.
      </p>
      <AssignmentsTable
        assignments={studentAssignments}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default AssignmentView;
