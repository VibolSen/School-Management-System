'use client';

import React, { useState, useEffect, useMemo } from 'react';
import AttendanceTable from './AttendanceTable';
import QRCodeGeneratorModal from './QRCodeGeneratorModal';

const FACULTY_ID = 'S001'; // Optional fallback or remove if using real user ID

const AttendanceView = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [currentUserRole, setCurrentUserRole] = useState(null);

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [courseFilter, setCourseFilter] = useState('All');

  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [selectedCourseForQr, setSelectedCourseForQr] = useState(null);
  const [qrCourseSelection, setQrCourseSelection] = useState('');
  const [liveCheckedInStudents, setLiveCheckedInStudents] = useState([]);

  // Fetch real data from APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [attendanceRes, coursesRes, studentsRes, userRes] = await Promise.all([
          fetch('/api/attendance'),
          fetch('/api/courses'),
          fetch('/api/students'),
          fetch('/api/me'),
        ]);

        const [attendanceData, coursesData, studentsData, userData] = await Promise.all([
          attendanceRes.json(),
          coursesRes.json(),
          studentsRes.json(),
          userRes.json(),
        ]);

        setAttendanceRecords(attendanceData);
        setCourses(coursesData);
        setStudents(studentsData);
        setCurrentUserRole(userData.role);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  const canGenerateQr = currentUserRole === 'FACULTY' || currentUserRole === 'ADMINISTRATOR';

  // Filter courses based on role
  const myCourses = useMemo(() => {
    if (currentUserRole === 'ADMINISTRATOR') return courses;
    if (currentUserRole === 'FACULTY') {
      return courses.filter(c => c.teacherId === FACULTY_ID);
    }
    return [];
  }, [courses, currentUserRole]);

  const handleCourseSelectionForQr = (courseId) => {
    setQrCourseSelection(courseId);

    if (!courseId) {
      setIsQrModalOpen(false);
      setSelectedCourseForQr(null);
      return;
    }

    const course = courses.find(c => c.id === courseId);
    if (course) {
      setLiveCheckedInStudents([]); // Reset for new session
      setSelectedCourseForQr(course);
      setIsQrModalOpen(true);
    }
  };

  const handleCloseQrModal = () => {
    setIsQrModalOpen(false);
    setSelectedCourseForQr(null);
    setQrCourseSelection('');
  };

  const totalStudentsInCourse = useMemo(() => {
    if (!selectedCourseForQr) return 0;
    return students.filter(student =>
      student.courses?.some(course => course.id === selectedCourseForQr.id)
    ).length;
  }, [selectedCourseForQr, students]);

  const handleStatusChange = (recordId, newStatus) => {
    setAttendanceRecords(prevRecords =>
      prevRecords.map(record =>
        record.id === recordId ? { ...record, status: newStatus } : record
      )
    );
  };

  const coursesByDepartment = useMemo(() => {
    if (departmentFilter === 'All') return courses;
    return courses.filter(c => c.department === departmentFilter);
  }, [departmentFilter, courses]);

  useEffect(() => {
    if (!coursesByDepartment.some(c => c.id === courseFilter)) {
      setCourseFilter('All');
    }
  }, [coursesByDepartment, courseFilter]);

  const displayData = useMemo(() => {
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
        const matchesStatus = record.status || 'All';
        return matchesDate && matchesDept && matchesCourse;
      })
      .sort((a,b) => a.studentName.localeCompare(b.studentName));
  }, [attendanceRecords, students, courses, selectedDate, departmentFilter, courseFilter]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Attendance Tracking</h1>
      <p className="text-slate-500">Monitor and manage student attendance records for daily classes.</p>

      {canGenerateQr && (
        <div className="bg-white p-4 rounded-xl shadow-md">
          <label htmlFor="qr-course-select" className="font-semibold text-slate-800 mb-2 block">
            Start Live QR Session
          </label>
          <p className="text-sm text-slate-500 mb-3">Select a course to instantly generate a time-limited QR code for attendance.</p>
          <select
            id="qr-course-select"
            value={qrCourseSelection}
            onChange={(e) => handleCourseSelectionForQr(e.target.value)}
            className="w-full sm:max-w-md px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            aria-label="Select a course to start a QR session"
            disabled={myCourses.length === 0}
          >
            <option value="" disabled>Select a course...</option>
            {myCourses.length > 0 ? (
              myCourses.map(course => <option key={course.id} value={course.id}>{course.name}</option>)
            ) : (
              <option disabled>No courses assigned</option>
            )}
          </select>
        </div>
      )}

      <div className="bg-white p-4 rounded-xl shadow-md sticky top-0 z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="date-filter" className="block text-sm font-medium text-slate-700 mb-1">Date</label>
            <input
              type="date"
              id="date-filter"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            />
          </div>
          <div>
            <label htmlFor="dept-filter" className="block text-sm font-medium text-slate-700 mb-1">Department</label>
            <select
              id="dept-filter"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            >
              <option value="All">All Departments</option>
              {/* Replace with actual department values if you have API */}
            </select>
          </div>
          <div>
            <label htmlFor="course-filter" className="block text-sm font-medium text-slate-700 mb-1">Course</label>
            <select
              id="course-filter"
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              disabled={departmentFilter !== 'All' && coursesByDepartment.length === 0}
            >
              <option value="All">All Courses</option>
              {coursesByDepartment.map(course => <option key={course.id} value={course.id}>{course.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <select
              id="status-filter"
              value={'All'} // You can add state for status filter
              onChange={() => {}}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            >
              <option value="All">All Statuses</option>
            </select>
          </div>
        </div>
      </div>

      <AttendanceTable
        records={displayData}
        onStatusChange={handleStatusChange}
      />

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
