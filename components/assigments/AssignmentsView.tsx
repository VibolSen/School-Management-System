"use client";

import React, { useState, useMemo } from "react";
import { useUser } from "@/context/UserContext";
import { Role, SubmissionStatus } from "@/lib/types";
import type { Assignment, Submission, Course } from "@/lib/types";
import {
  MOCK_COURSES,
  MOCK_ASSIGNMENTS,
  MOCK_SUBMISSIONS,
  MOCK_STUDENT_DATA,
} from "@/lib/constants";
import PlaceholderView from "@/components/PlaceholderView";
import AddAssignmentModal from "@/components/assigments/AddAssignmentModal";
import SubmissionDetailView from "@/components/SubmissionDetailView";

// Mock IDs for current users
const FACULTY_ID = "S001"; // Dr. Evelyn Reed
const STUDENT_ID = "STU001"; // Alice Johnson

// --- Faculty View Component ---
const FacultyAssignments: React.FC = () => {
  const [assignments, setAssignments] =
    useState<Assignment[]>(MOCK_ASSIGNMENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(
    null
  );
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<
    string | null
  >(null);

  const myCourses = useMemo(
    () => MOCK_COURSES.filter((c) => c.teacherId === FACULTY_ID),
    []
  );

  const assignmentsByCourse = useMemo(() => {
    return myCourses.map((course) => {
      const courseAssignments = assignments
        .filter((a) => a.courseId === course.id)
        .sort(
          (a, b) =>
            new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
        );

      const assignmentsWithSubmissions = courseAssignments.map((assignment) => {
        const totalStudents = MOCK_STUDENT_DATA.filter((s) =>
          s.courses.some((c) => c.id === course.id)
        ).length;
        const submissions = MOCK_SUBMISSIONS.filter(
          (s) => s.assignmentId === assignment.id
        );

        const gradedCount = submissions.filter(
          (s) => s.status === SubmissionStatus.GRADED
        ).length;
        const submittedCount = submissions.filter(
          (s) => s.status === SubmissionStatus.SUBMITTED
        ).length;
        const lateCount = submissions.filter(
          (s) => s.status === SubmissionStatus.LATE
        ).length;
        const totalSubmitted = gradedCount + submittedCount + lateCount;
        const pendingCount = totalStudents - totalSubmitted;

        return {
          ...assignment,
          submissionCount: totalSubmitted,
          totalStudents,
          gradedCount,
          submittedCount,
          lateCount,
          pendingCount,
        };
      });
      return {
        ...course,
        assignments: assignmentsWithSubmissions,
      };
    });
  }, [myCourses, assignments]);

  const handleEditAssignment = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setIsModalOpen(true);
  };

  const handleSaveAssignment = (data: Omit<Assignment, "id">) => {
    if (editingAssignment) {
      // Edit existing assignment
      const updatedAssignment = { ...editingAssignment, ...data };
      const updatedAssignments = assignments.map((a) =>
        a.id === editingAssignment.id ? updatedAssignment : a
      );
      MOCK_ASSIGNMENTS.splice(
        0,
        MOCK_ASSIGNMENTS.length,
        ...updatedAssignments
      ); // Mutate mock
      setAssignments(updatedAssignments);
    } else {
      // Create new assignment
      const newAssignment: Assignment = {
        id: `AS${Date.now()}`, // Simple unique ID
        ...data,
      };
      const updatedAssignments = [...assignments, newAssignment];
      MOCK_ASSIGNMENTS.push(newAssignment); // Mutate the mock data source
      setAssignments(updatedAssignments);
    }
    setIsModalOpen(false);
    setEditingAssignment(null);
  };

  const totalAssignments = useMemo(
    () =>
      assignments.filter((a) => myCourses.some((c) => c.id === a.courseId))
        .length,
    [assignments, myCourses]
  );

  const handleViewSubmissions = (assignmentId: string) => {
    setSelectedAssignmentId(assignmentId);
  };

  const handleBackToAssignments = () => {
    setSelectedAssignmentId(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAssignment(null);
  };

  const selectedAssignmentData = useMemo(() => {
    if (!selectedAssignmentId) return null;

    const assignment = assignments.find((a) => a.id === selectedAssignmentId);
    if (!assignment) return null;

    const course = myCourses.find((c) => c.id === assignment.courseId);
    if (!course) return null;

    return { assignment, course };
  }, [selectedAssignmentId, assignments, myCourses]);

  if (selectedAssignmentData) {
    return (
      <SubmissionDetailView
        assignment={selectedAssignmentData.assignment}
        course={selectedAssignmentData.course}
        onBack={handleBackToAssignments}
        onEdit={handleEditAssignment}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Assignments Overview
          </h1>
          <p className="text-slate-500">
            Review, create, and manage assignments for your courses.
          </p>
        </div>
        {myCourses.length > 0 && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full md:w-auto bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 transition"
          >
            Create Assignment
          </button>
        )}
      </div>

      {assignmentsByCourse.map((course) => (
        <div key={course.id} className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            {course.name}
          </h2>
          {course.assignments.length > 0 ? (
            <ul className="divide-y divide-slate-200">
              {course.assignments.map((assignment) => (
                <li
                  key={assignment.id}
                  className="py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3"
                >
                  <div className="w-full">
                    <p className="font-semibold text-slate-700">
                      {assignment.title}
                    </p>
                    <p className="text-sm text-slate-500">
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="w-full flex flex-col md:flex-row items-start md:items-center gap-x-6 gap-y-2">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                      <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-green-500"></span>
                        <span className="font-medium text-slate-600">
                          {assignment.gradedCount} Graded
                        </span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                        <span className="font-medium text-slate-600">
                          {assignment.submittedCount} Submitted
                        </span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                        <span className="font-medium text-slate-600">
                          {assignment.lateCount} Late
                        </span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-slate-400"></span>
                        <span className="font-medium text-slate-600">
                          {assignment.pendingCount} Pending
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center gap-4 shrink-0 ml-auto">
                      <button
                        onClick={() => handleEditAssignment(assignment)}
                        className="text-sm font-medium text-slate-600 hover:text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleViewSubmissions(assignment.id)}
                        className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline shrink-0"
                      >
                        <span>View Submissions</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            fillRule="evenodd"
                            d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center text-sm text-slate-500 py-6">
              No assignments have been created for this course yet.
            </div>
          )}
        </div>
      ))}

      {myCourses.length > 0 && totalAssignments === 0 && (
        <div className="text-center py-20 bg-white rounded-xl shadow-md">
          <svg
            className="mx-auto h-12 w-12 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
          <h3 className="mt-2 text-sm font-semibold text-slate-900">
            No Assignments Found
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Get started by creating the first assignment for one of your
            courses.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 transition"
          >
            Create Your First Assignment
          </button>
        </div>
      )}

      {myCourses.length === 0 && (
        <div className="text-center py-20 bg-white rounded-xl shadow-md">
          <p className="text-slate-500">
            You are not assigned to any courses to create assignments for.
          </p>
        </div>
      )}

      <AddAssignmentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveAssignment}
        courses={myCourses}
        assignmentToEdit={editingAssignment}
      />
    </div>
  );
};

// --- Student View Component ---
const StudentAssignments: React.FC = () => {
  const [lastUpdated, setLastUpdated] = useState(Date.now());

  const myAssignments = useMemo(() => {
    const myProfile = MOCK_STUDENT_DATA.find((s) => s.id === STUDENT_ID);
    if (!myProfile) return [];

    const myCourseIds = myProfile.courses.map((c) => c.id);
    const allAssignments = MOCK_ASSIGNMENTS.filter((a) =>
      myCourseIds.includes(a.courseId)
    );

    return allAssignments
      .map((assignment) => {
        const course = MOCK_COURSES.find((c) => c.id === assignment.courseId);
        let submission = MOCK_SUBMISSIONS.find(
          (s) => s.assignmentId === assignment.id && s.studentId === STUDENT_ID
        );

        if (!submission) {
          submission = {
            id: `newsub-${assignment.id}`,
            assignmentId: assignment.id,
            studentId: STUDENT_ID,
            submissionDate: null,
            status: SubmissionStatus.PENDING,
            grade: null,
          };
        }
        return {
          ...assignment,
          courseName: course?.name || "Unknown Course",
          submission,
        };
      })
      .sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      );
  }, [lastUpdated]);

  const handleSubmission = (assignmentId: string) => {
    const existingIndex = MOCK_SUBMISSIONS.findIndex(
      (s) => s.assignmentId === assignmentId && s.studentId === STUDENT_ID
    );
    const assignment = MOCK_ASSIGNMENTS.find((a) => a.id === assignmentId);
    const isLate = new Date() > new Date(assignment!.dueDate);

    const newSubmission: Submission = {
      id: `sub-${Date.now()}`,
      assignmentId: assignmentId,
      studentId: STUDENT_ID,
      submissionDate: new Date().toISOString().split("T")[0],
      status: isLate ? SubmissionStatus.LATE : SubmissionStatus.SUBMITTED,
      grade: null,
    };

    if (existingIndex > -1) {
      MOCK_SUBMISSIONS[existingIndex] = newSubmission;
    } else {
      MOCK_SUBMISSIONS.push(newSubmission);
    }
    setLastUpdated(Date.now());
  };

  const getStatusBadge = (status: SubmissionStatus, grade: number | null) => {
    switch (status) {
      case SubmissionStatus.PENDING:
        return (
          <span className="px-2 py-1 text-xs font-semibold text-slate-800 bg-slate-200 rounded-full">
            Pending
          </span>
        );
      case SubmissionStatus.SUBMITTED:
        return (
          <span className="px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-200 rounded-full">
            Submitted
          </span>
        );
      case SubmissionStatus.LATE:
        return (
          <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-200 rounded-full">
            Late
          </span>
        );
      case SubmissionStatus.GRADED:
        return (
          <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-200 rounded-full">
            Graded: {grade}%
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-slate-800">My Assignments</h1>
      <p className="text-slate-500">
        Keep track of your upcoming and submitted coursework.
      </p>
      <div className="bg-white p-6 rounded-xl shadow-md">
        <ul className="divide-y divide-slate-200">
          {myAssignments.map(({ ...assignment }) => (
            <li
              key={assignment.id}
              className="py-4 flex flex-col md:flex-row justify-between items-start md:items-center"
            >
              <div>
                <p className="font-semibold text-slate-700">
                  {assignment.title}
                </p>
                <p className="text-sm text-slate-500">
                  {assignment.courseName} &bull; Due:{" "}
                  {new Date(assignment.dueDate).toLocaleDateString()}
                </p>
              </div>
              <div className="mt-2 md:mt-0 flex items-center gap-4">
                <div className="text-right">
                  {getStatusBadge(
                    assignment.submission.status,
                    assignment.submission.grade
                  )}
                  <p className="text-xs text-slate-500 mt-1">
                    {assignment.submission.submissionDate
                      ? `Submitted: ${new Date(
                          assignment.submission.submissionDate
                        ).toLocaleDateString()}`
                      : "Not Submitted"}
                  </p>
                </div>
                {assignment.submission.status === SubmissionStatus.PENDING && (
                  <button
                    onClick={() => handleSubmission(assignment.id)}
                    className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-blue-700 transition"
                  >
                    Submit
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
        {myAssignments.length === 0 && (
          <div className="text-center py-10 text-slate-500">
            <p>You have no assignments at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main View Component ---
const AssignmentsView: React.FC = () => {
  const { currentUserRole } = useUser();

  switch (currentUserRole) {
    case Role.FACULTY:
      return <FacultyAssignments />;
    case Role.STUDENT:
      return <StudentAssignments />;
    default:
      // Admins and HR don't have an assignments view
      return <PlaceholderView title="Assignments Not Applicable" />;
  }
};

export default AssignmentsView;
