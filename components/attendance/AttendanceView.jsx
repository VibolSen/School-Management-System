'use client';

import React, { useState, useMemo, useEffect } from 'react';
import AttendanceTable from '@/components/AttendanceTable';
import QRCodeGeneratorModal from '@/components/QRCodeGeneratorModal';
import { MOCK_ATTENDANCE_DATA, MOCK_COURSES, MOCK_STUDENT_DATA, eventEmitter, StudentCheckInPayload, MOCK_DEPARTMENTS } from '@/lib/constants';
import type { AttendanceRecord, Course, Student } from '@/lib/types';
import { AttendanceStatus, Role } from '@/lib/types';
import { useUser } from '@/context/UserContext';

const FACULTY_ID = 'S001'; // Mock current faculty user

const AttendanceView: React.FC = () => {
  const { currentUserRole } = useUser();
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(MOCK_ATTENDANCE_DATA);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [departmentFilter, setDepartmentFilter] = useState<string>('All');
  const [courseFilter, setCourseFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [selectedCourseForQr, setSelectedCourseForQr] = useState<Course | null>(null);
  const [qrCourseSelection, setQrCourseSelection] = useState<string>('');
  const [liveCheckedInStudents, setLiveCheckedInStudents] = useState<Student[]>([]);
  
  const canGenerateQr = currentUserRole === Role.FACULTY || currentUserRole === Role.ADMINISTRATOR;

  useEffect(() => {
    const handleCheckIn = (data: StudentCheckInPayload) => {
        if (isQrModalOpen && data.course.id === selectedCourseForQr?.id) {
            setLiveCheckedInStudents(prev => {
                if (prev.some(s => s.id === data.student.id)) {
                    return prev;
                }
                return [...prev, data.student].sort((a,b) => a.name.localeCompare(b.name));
            });
        }
    };
    
    eventEmitter.subscribe<StudentCheckInPayload>('studentCheckedIn', handleCheckIn);

    return () => {
        eventEmitter.unsubscribe<StudentCheckInPayload>('studentCheckedIn', handleCheckIn);
    };
  }, [isQrModalOpen, selectedCourseForQr]);


  // For QR generation, faculty can only select their own courses
  const myCourses = useMemo(() => {
    if (currentUserRole === Role.ADMINISTRATOR) return MOCK_COURSES;
    if (currentUserRole === Role.FACULTY) {
      return MOCK_COURSES.filter(c => c.teacherId === FACULTY_ID);
    }
    return [];
  }, [currentUserRole]);

  const handleCourseSelectionForQr = (courseId: string) => {
    setQrCourseSelection(courseId);

    if (!courseId) {
      setIsQrModalOpen(false);
      setSelectedCourseForQr(null);
      return;
    }

    const course = MOCK_COURSES.find(c => c.id === courseId);
    if (course) {
      setLiveCheckedInStudents([]); // Reset for new session
      setSelectedCourseForQr(course);
      setIsQrModalOpen(true);
    }
  };
  
  const handleCloseQrModal = () => {
    setIsQrModalOpen(false);
    setSelectedCourseForQr(null);
    setQrCourseSelection(''); // Reset dropdown to placeholder
  };

  const totalStudentsInCourse = useMemo(() => {
    if (!selectedCourseForQr) return 0;
    return MOCK_STUDENT_DATA.filter(student => 
      student.courses.some(course => course.id === selectedCourseForQr.id)
    ).length;
  }, [selectedCourseForQr]);


  const handleStatusChange = (recordId: string, newStatus: AttendanceStatus) => {
    setAttendanceRecords(prevRecords =>
      prevRecords.map(record =>
        record.id === recordId ? { ...record, status: newStatus } : record
      )
    );
  };

  const coursesByDepartment = useMemo(() => {
    if (departmentFilter === 'All') return MOCK_COURSES;
    return MOCK_COURSES.filter(c => c.department === departmentFilter);
  }, [departmentFilter]);

  // Reset course filter if it's no longer valid for the selected department
  React.useEffect(() => {
    if (!coursesByDepartment.some(c => c.id === courseFilter)) {
        setCourseFilter('All');
    }
  }, [coursesByDepartment, courseFilter]);

  const displayData = useMemo(() => {
    const studentMap = new Map(MOCK_STUDENT_DATA.map(s => [s.id, s]));
    const courseMap = new Map(MOCK_COURSES.map(c => [c.id, c]));

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
      .filter((record): record is Exclude<typeof record, null> => {
        if (!record) return false;
        const matchesDate = record.date === selectedDate;
        const matchesDept = departmentFilter === 'All' || record.department === departmentFilter;
        const matchesCourse = courseFilter === 'All' || record.courseId === courseFilter;
        const matchesStatus = statusFilter === 'All' || record.status === statusFilter;
        return matchesDate && matchesDept && matchesCourse && matchesStatus;
      })
      .sort((a,b) => a.studentName.localeCompare(b.studentName));
  }, [attendanceRecords, selectedDate, departmentFilter, courseFilter, statusFilter]);

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
                {MOCK_DEPARTMENTS.map(dep => <option key={dep.id} value={dep.name}>{dep.name}</option>)}
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
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            >
                <option value="All">All Statuses</option>
                {Object.values(AttendanceStatus).map(s => <option key={s} value={s}>{s}</option>)}
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