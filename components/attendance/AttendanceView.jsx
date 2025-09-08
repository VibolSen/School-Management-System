'use client';

import React, { useState, useMemo, useEffect } from 'react';
import AttendanceTable from './AttendanceTable';
import QRCodeGeneratorModal from './QRCodeGeneratorModal';

const AttendanceView = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [attendanceStatuses, setAttendanceStatuses] = useState([]);

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [courseFilter, setCourseFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [selectedCourseForQr, setSelectedCourseForQr] = useState(null);
  const [qrCourseSelection, setQrCourseSelection] = useState('');
  const [liveCheckedInStudents, setLiveCheckedInStudents] = useState([]);

  // Hardcoded role for now (replace with real auth later)
  const currentUserRole = 'administrator';
  const canGenerateQr = currentUserRole === 'faculty' || currentUserRole === 'administrator';

  // -------------------------------
  // Fetch courses, users, departments, and attendance statuses
  // -------------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, usersRes, departmentsRes, statusesRes] = await Promise.all([
          fetch('/api/courses'),
          fetch('/api/users'),       // students now come from /api/users
          fetch('/api/departments'),
          fetch('/api/attendance-status'), // dynamic status fetch
        ]);

        const coursesData = coursesRes.ok ? await coursesRes.json() : [];
        const studentsData = usersRes.ok ? await usersRes.json() : [];
        const departmentsData = departmentsRes.ok ? await departmentsRes.json() : [];
        const statusesData = statusesRes.ok ? await statusesRes.json() : [];

        setCourses(Array.isArray(coursesData) ? coursesData : []);
        setStudents(Array.isArray(studentsData) ? studentsData : []);
        setDepartments(Array.isArray(departmentsData) ? departmentsData : []);
        setAttendanceStatuses(Array.isArray(statusesData) ? statusesData : []);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setCourses([]);
        setStudents([]);
        setDepartments([]);
        setAttendanceStatuses([]);
      }
    };

    fetchData();
  }, []);

  // -------------------------------
  // QR modal handlers
  // -------------------------------
  const handleCourseSelectionForQr = (courseId) => {
    setQrCourseSelection(courseId);
    if (!courseId) {
      setIsQrModalOpen(false);
      setSelectedCourseForQr(null);
      return;
    }
    const course = courses.find(c => c.id === courseId);
    if (course) {
      setLiveCheckedInStudents([]);
      setSelectedCourseForQr(course);
      setIsQrModalOpen(true);
    }
  };

  const handleCloseQrModal = () => {
    setIsQrModalOpen(false);
    setSelectedCourseForQr(null);
    setQrCourseSelection('');
  };

  // -------------------------------
  // Total students in selected course
  // -------------------------------
  const totalStudentsInCourse = useMemo(() => {
    if (!selectedCourseForQr || !Array.isArray(students)) return 0;
    return students.filter(student =>
      Array.isArray(student.courses) &&
      student.courses.some(course => course.id === selectedCourseForQr.id)
    ).length;
  }, [students, selectedCourseForQr]);

  // -------------------------------
  // Update attendance status
  // -------------------------------
  const handleStatusChange = async (recordId, newStatus) => {
    try {
      await fetch(`/api/attendance/${recordId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      setAttendanceRecords(prev =>
        prev.map(record => record.id === recordId ? { ...record, status: newStatus } : record)
      );
    } catch (error) {
      console.error('Failed to update attendance:', error);
    }
  };

  // -------------------------------
  // Filter courses by department
  // -------------------------------
  const coursesByDepartment = useMemo(() => {
    if (departmentFilter === 'All') return courses;
    return courses.filter(c => c.department === departmentFilter);
  }, [departmentFilter, courses]);

  useEffect(() => {
    if (!coursesByDepartment.some(c => c.id === courseFilter)) {
      setCourseFilter('All');
    }
  }, [coursesByDepartment, courseFilter]);

  // -------------------------------
  // Prepare display data
  // -------------------------------
  const displayData = useMemo(() => {
    if (!Array.isArray(students) || !Array.isArray(courses)) return [];

    const studentMap = new Map(students.map(s => [s.id, s]));
    const courseMap = new Map(courses.map(c => [c.id, c]));

    return attendanceRecords
      .map(record => {
        const student = studentMap.get(record.studentId);
        const course = courseMap.get(record.courseId);
        if (!student || !course) return null;
        return {
          ...record,
          studentName: student.name,
          courseName: course.name,
          department: course.department,
        };
      })
      .filter(record => {
        if (!record) return false;
        const matchesDate = record.date === selectedDate;
        const matchesDept = departmentFilter === 'All' || record.department === departmentFilter;
        const matchesCourse = courseFilter === 'All' || record.courseId === courseFilter;
        const matchesStatus = statusFilter === 'All' || record.status === statusFilter;
        return matchesDate && matchesDept && matchesCourse && matchesStatus;
      })
      .sort((a, b) => a.studentName.localeCompare(b.studentName));
  }, [attendanceRecords, selectedDate, departmentFilter, courseFilter, statusFilter, students, courses]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Attendance Tracking</h1>
      <p className="text-slate-500">Monitor and manage student attendance records for daily classes.</p>

      {/* QR Generator */}
      {canGenerateQr && (
        <div className="bg-white p-4 rounded-xl shadow-md">
          <label htmlFor="qr-course-select" className="font-semibold text-slate-800 mb-2 block">
            Start Live QR Session
          </label>
          <select
            id="qr-course-select"
            value={qrCourseSelection}
            onChange={e => handleCourseSelectionForQr(e.target.value)}
            className="w-full sm:max-w-md px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
          >
            <option value="">Select a course...</option>
            {coursesByDepartment.map(course => (
              <option key={course.id} value={course.id} className="text-slate-800">
                {course.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-md sticky top-0 z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Date */}
          <div>
            <label htmlFor="date-filter" className="block text-sm font-medium text-slate-700 mb-1">Date</label>
            <input
              type="date"
              id="date-filter"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            />
          </div>

          {/* Department */}
          <div>
            <label htmlFor="dept-filter" className="block text-sm font-medium text-slate-700 mb-1">Department</label>
            <select
              id="dept-filter"
              value={departmentFilter}
              onChange={e => setDepartmentFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            >
              <option value="All">All Departments</option>
              {departments.map(dep => (
                <option key={dep.id} value={dep.name} className="text-slate-800">
                  {dep.name}
                </option>
              ))}
            </select>
          </div>

          {/* Course */}
          <div>
            <label htmlFor="course-filter" className="block text-sm font-medium text-slate-700 mb-1">Course</label>
            <select
              id="course-filter"
              value={courseFilter}
              onChange={e => setCourseFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            >
              <option value="All">All Courses</option>
              {coursesByDepartment.map(course => (
                <option key={course.id} value={course.id} className="text-slate-800">
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            >
              <option value="All">All Statuses</option>
              {attendanceStatuses.map(status => (
                <option key={status.id} value={status.name} className="text-slate-800">
                  {status.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <AttendanceTable records={displayData} onStatusChange={handleStatusChange} />

      {/* QR Modal */}
      <QRCodeGeneratorModal
        isOpen={isQrModalOpen}
        onClose={handleCloseQrModal}
        course={selectedCourseForQr}
        checkedInStudents={liveCheckedInStudents}
        totalStudents={totalStudentsInCourse}
      />
    </div>
  );
};

export default AttendanceView;
