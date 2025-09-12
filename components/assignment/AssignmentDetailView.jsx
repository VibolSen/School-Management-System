// FILE: components/assignments/AssignmentDetailView.jsx

"use client";

import React, { useState, useEffect, useCallback } from "react";
import SubmissionModal from "./SubmissionModal";
import Notification from "@/components/Notification"; // Assuming you have this

const AssignmentDetailView = ({ assignmentId }) => {
  const [assignment, setAssignment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  const showMessage = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "" }),
      3000
    );
  };

  const fetchAssignmentDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/assignments?id=${assignmentId}`);
      if (!res.ok) throw new Error("Failed to fetch assignment details.");
      const data = await res.json();
      setAssignment(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [assignmentId]);

  useEffect(() => {
    fetchAssignmentDetails();
  }, [fetchAssignmentDetails]);

  const handleSubmission = async (submissionData) => {
    try {
      // Find the status ID for "Submitted" (this is a placeholder, adjust if needed)
      // You might need to fetch statuses from your API to do this dynamically
      const SUBMITTED_STATUS_ID = "clxh0f2t1000508l7hy7i9a2s"; // Replace with the actual ID for "Submitted"

      const payload = {
        ...submissionData,
        statusId: SUBMITTED_STATUS_ID,
        submittedAt: new Date().toISOString(),
      };

      const res = await fetch(`/api/assignments?id=${assignmentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to submit.");
      }

      showMessage("Assignment submitted successfully!");
      setIsModalOpen(false);
      fetchAssignmentDetails(); // Refresh data to show new status
    } catch (err) {
      showMessage(err.message, "error");
    }
  };

  if (isLoading)
    return <p className="text-center py-10">Loading assignment details...</p>;
  if (error)
    return <p className="text-center py-10 text-red-500">Error: {error}</p>;
  if (!assignment) return <p>Assignment not found.</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Notification
        show={notification.show}
        message={notification.message}
        type={notification.type}
      />
      <div className="bg-white shadow-lg rounded-lg p-8">
        {/* Header */}
        <div className="border-b pb-4 mb-6">
          <h1 className="text-3xl font-bold text-slate-800">
            {assignment.assignment?.title}
          </h1>
          <p className="text-slate-600 mt-1">
            Course: {assignment.assignment?.course?.title}
          </p>
          <p className="text-sm text-slate-500 mt-2">
            Due Date:{" "}
            {new Date(assignment.assignment?.dueDate).toLocaleString()}
          </p>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-slate-700 mb-2">
            Instructions
          </h2>
          <p className="text-slate-600 whitespace-pre-wrap">
            {assignment.assignment?.description || "No instructions provided."}
          </p>
        </div>

        {/* Submission Status */}
        <div className="bg-slate-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-slate-700 mb-3">
            My Submission
          </h2>
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-semibold">Status:</span>{" "}
              {assignment.status?.name}
            </p>
            <p>
              <span className="font-semibold">Grade:</span>{" "}
              {assignment.grade ?? "Not Graded"}
            </p>
            <p>
              <span className="font-semibold">Feedback:</span>{" "}
              {assignment.feedback || "No feedback yet."}
            </p>
            <p className="font-semibold">Submitted Content:</p>
            <div className="p-3 bg-white border rounded-md text-slate-700">
              <p>{assignment.content || "You haven't submitted anything."}</p>
              {assignment.fileUrl && (
                <a
                  href={assignment.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline mt-2 inline-block"
                >
                  View Submitted File
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 text-white font-bold px-8 py-3 rounded-lg hover:bg-indigo-700 transition-transform transform hover:scale-105 shadow-lg"
            // Disable button if already graded to prevent re-submission
            disabled={!!assignment.grade}
          >
            {assignment.content ? "Resubmit Assignment" : "Submit Assignment"}
          </button>
          {!!assignment.grade && (
            <p className="text-xs text-slate-500 mt-2">
              This assignment has been graded and can no longer be edited.
            </p>
          )}
        </div>
      </div>

      <SubmissionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmission}
        currentSubmission={assignment}
      />
    </div>
  );
};

export default AssignmentDetailView;
