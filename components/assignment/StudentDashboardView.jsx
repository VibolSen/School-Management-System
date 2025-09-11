// FILE: components/assignments/StudentDashboardView.jsx

"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation"; // Use Next.js's App Router hook
import { useUser } from "@/context/UserContext"; // Your user context
import AssignmentCard from "./AssignmentCard";
// import AssignmentCard from "@/components/assignment/AssignmentCard"; // We can reuse the card from before

const StudentDashboardView = () => {
  const { user } = useUser();
  const router = useRouter();
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/assignments");
        if (!res.ok) {
          throw new Error(`Failed to fetch assignments: ${res.statusText}`);
        }
        const data = await res.json();
        setAssignments(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  // Filter assignments for the current student
  const studentAssignments = useMemo(() => {
    if (!user || !assignments) return [];
    // Ensure you compare types correctly (e.g., both as strings)
    return assignments.filter((a) => String(a.studentId) === String(user.id));
  }, [user, assignments]);

  // Navigate to the detail page on click
  const handleCardClick = (assignmentId) => {
    router.push(`/student/assignments/${assignmentId}`);
  };

  if (isLoading) {
    return <p className="text-center py-10">Loading your assignments...</p>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">My Assignments</h1>
        <p className="text-slate-500 mt-1">
          Here are the assignments for your courses. Click on one to see details
          and submit.
        </p>
      </div>

      {error && (
        <div className="text-red-500 bg-red-50 p-4 rounded-lg">
          Error: {error}
        </div>
      )}

      {studentAssignments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studentAssignments.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              onClick={() => handleCardClick(assignment.id)}
            />
          ))}
        </div>
      ) : (
        !error && (
          <p className="text-center py-10 text-slate-600">
            You have no assignments at the moment.
          </p>
        )
      )}
    </div>
  );
};

export default StudentDashboardView;
