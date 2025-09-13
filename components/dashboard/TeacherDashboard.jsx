"use client";

import React, { useState, useEffect, useMemo } from "react";
import DashboardCard from "@/components/dashboard/DashboardCard";
import ClipboardListIcon from "@/components/icons/ClipboardListIcon";
import CalendarIcon from "@/components/icons/CalendarIcon";
import BellIcon from "@/components/icons/BellIcon";
import UsersIcon from "@/components/icons/UsersIcon";
import { SubmissionStatus } from "@/lib/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const TeacherDashboard = () => {
  const [myCourses, setMyCourses] = useState([]);
  const [myAssignments, setMyAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teacher, setTeacher] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const meResponse = await fetch("/api/me");
        if (!meResponse.ok) {
          throw new Error("Failed to fetch user data");
        }
        const me = await meResponse.json();
        setTeacher(me);
        const teacherId = me.id;

        const coursesResponse = await fetch(`/api/courses?teacherId=${teacherId}`);
        if (!coursesResponse.ok) {
          throw new Error("Failed to fetch courses");
        }
        const coursesData = await coursesResponse.json();
        setMyCourses(coursesData);

        const courseIds = coursesData.map((c) => c.id);
        const assignmentsPromises = courseIds.map((courseId) =>
          fetch(`/api/assignments?courseId=${courseId}`)
        );
        const assignmentsResponses = await Promise.all(assignmentsPromises);
        const assignmentsData = await Promise.all(
          assignmentsResponses.map((res) => res.json())
        );
        const allAssignments = assignmentsData.flat();
        setMyAssignments(allAssignments);

        const assignmentIds = allAssignments.map((a) => a.id);
        const submissionsPromises = assignmentIds.map((assignmentId) =>
          fetch(`/api/submissions?assignmentId=${assignmentId}`)
        );
        const submissionsResponses = await Promise.all(submissionsPromises);
        const submissionsData = await Promise.all(
          submissionsResponses.map((res) => res.json())
        );
        setSubmissions(submissionsData.flat());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const assignmentsToGrade = useMemo(() => {
    return submissions.filter(
      (s) =>
        myAssignments.some((a) => a.id === s.assignmentId) &&
        (s.status === SubmissionStatus.SUBMITTED ||
          s.status === SubmissionStatus.LATE)
    ).length;
  }, [myAssignments, submissions]);

  const upcomingDueDate = useMemo(() => {
    const futureAssignments = myAssignments
      .filter((a) => new Date(a.dueDate) >= new Date())
      .sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      );

    return futureAssignments.length > 0 ? futureAssignments[0] : null;
  }, [myAssignments]);

  const studentQuestionCount = useMemo(() => {
    // Mock data for student questions feature
    return 3;
  }, []);

  const classesToday = useMemo(() => {
    // Mock data, assuming 2 classes today
    return myCourses.length > 1 ? 2 : myCourses.length;
  }, [myCourses]);

  const submissionsPerAssignment = useMemo(() => {
    return myAssignments
      .map((assignment) => {
        const assignmentSubmissions = submissions.filter(
          (s) => s.assignmentId === assignment.id
        );
        return {
          name:
            assignment.title.length > 15
              ? assignment.title.substring(0, 15) + "..."
              : assignment.title,
          Submissions: assignmentSubmissions.length,
        };
      })
      .slice(0, 5);
  }, [myAssignments, submissions]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-slate-800">
        Welcome back, {teacher?.name}!
      </h1>
      <p className="text-slate-500">Your teaching dashboard for today.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Classes Today"
          value={classesToday.toString()}
          icon={<CalendarIcon />}
        />
        <DashboardCard
          title="Assignments to Grade"
          value={assignmentsToGrade.toString()}
          icon={<ClipboardListIcon />}
        />
        <DashboardCard
          title="Next Due Date"
          value={
            upcomingDueDate
              ? new Date(upcomingDueDate.dueDate).toLocaleDateString()
              : "N/A"
          }
          icon={<BellIcon />}
        />
        <DashboardCard
          title="New Student Questions"
          value={studentQuestionCount.toString()}
          icon={<UsersIcon />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-slate-800">
            Recent Assignment Submissions
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={submissionsPerAssignment}
              margin={{ top: 5, right: 20, left: -10, bottom: 50 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar
                dataKey="Submissions"
                fill="#3b82f6"
                name="Total Submissions"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-slate-800">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <button className="w-full text-left p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition">
              <p className="font-semibold text-slate-700">Post Announcement</p>
              <p className="text-sm text-slate-500">
                Share updates with your classes.
              </p>
            </button>
            <button className="w-full text-left p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition">
              <p className="font-semibold text-slate-700">Schedule a Meeting</p>
              <p className="text-sm text-slate-500">
                Set up a video call with a student.
              </p>
            </button>
            <button className="w-full text-left p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition">
              <p className="font-semibold text-slate-700">
                View Weekly Schedule
              </p>
              <p className="text-sm text-slate-500">
                See your upcoming classes and events.
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
