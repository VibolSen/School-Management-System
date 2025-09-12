// FILE: components/assignment/StudentDashboardView.jsx

"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext"; // Your user context
import AssignmentCard from "./AssignmentCard"; // Corrected path

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

  const studentAssignments = useMemo(() => {
    // --- START OF DEBUGGING BLOCK ---
    console.log("Filtering assignments...");
    if (!user) {
      console.log("Cannot filter: User object from context is missing.");
      return [];
    }
    console.log("Logged-in user ID:", user.id);

    if (assignments.length > 0) {
      console.log(
        "First assignment record's studentId:",
        assignments[0].studentId
      );
    }
    // --- END OF DEBUGGING BLOCK ---

    if (!user || !assignments) return [];

    return assignments.filter((a) => String(a.studentId) === String(user.id));
  }, [user, assignments]);

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
