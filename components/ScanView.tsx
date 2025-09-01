'use client';

import React, { useState, useEffect } from 'react';
import QRCodeScanner from '@/components/QRCodeScanner';
import { useUser } from '@/context/UserContext';
import { MOCK_ATTENDANCE_DATA, MOCK_COURSES, MOCK_STUDENT_DATA, eventEmitter, StudentCheckInPayload } from '@/lib/constants';
import { Role, AttendanceStatus } from '@/lib/types';

const STUDENT_ID = 'STU001'; // Mock current student (Alice)
const QR_CODE_VALIDITY_MS = 120 * 1000; // 2 minutes, should match generator

type ScanStatus = 'scanning' | 'success' | 'error' | 'info';

const ScanView: React.FC = () => {
  const { currentUserRole } = useUser();
  const [scanStatus, setScanStatus] = useState<ScanStatus>('scanning');
  const [scanMessage, setScanMessage] = useState('Point your camera at a QR code to mark your attendance.');
  const [showScanner, setShowScanner] = useState(true);

  const handleScan = (data: string) => {
    setShowScanner(false); // Hide scanner after a successful scan attempt

    try {
      const { courseId, timestamp } = JSON.parse(data);
      
      // Basic validation
      if (!courseId || typeof timestamp !== 'number') {
        throw new Error('Invalid QR code format.');
      }
      
      // Time validation
      if (Date.now() - timestamp > QR_CODE_VALIDITY_MS) {
        setScanStatus('error');
        setScanMessage('This QR code has expired. Please ask for a new one.');
        return;
      }
      
      // Check if course exists
      const course = MOCK_COURSES.find(c => c.id === courseId);
      if (!course) {
        setScanStatus('error');
        setScanMessage('Scanned an invalid course code.');
        return;
      }

      // Determine user ID based on role (for this prototype)
      if (currentUserRole !== Role.STUDENT) {
          setScanStatus('info');
          setScanMessage(`Scanned course: ${course.name}. Attendance only recorded for students.`);
          return;
      }
      const studentId = STUDENT_ID;

      // Check if student is enrolled
      const student = MOCK_STUDENT_DATA.find(s => s.id === studentId);
      if (!student || !student.courses.some(c => c.id === courseId)) {
        setScanStatus('error');
        setScanMessage(`You are not enrolled in ${course.name}.`);
        return;
      }

      const todayString = new Date().toISOString().split('T')[0];

      // Check if already marked
      const existingRecord = MOCK_ATTENDANCE_DATA.find(
        r => r.studentId === studentId && r.courseId === courseId && r.date === todayString
      );

      if (existingRecord) {
        setScanStatus('info');
        setScanMessage(`You have already been marked as "${existingRecord.status}" for ${course.name} today.`);
        return;
      }

      // Add new record
      const newRecord = {
        id: `ATT${MOCK_ATTENDANCE_DATA.length + 100}`, // semi-unique ID
        studentId: studentId,
        courseId: courseId,
        date: todayString,
        status: AttendanceStatus.PRESENT,
      };
      MOCK_ATTENDANCE_DATA.push(newRecord);
      
      eventEmitter.dispatch<StudentCheckInPayload>('studentCheckedIn', { student, course });
      
      setScanStatus('success');
      setScanMessage(`Success! Your attendance for ${course.name} has been marked as Present.`);

    } catch (error) {
      setScanStatus('error');
      setScanMessage('Failed to read QR code. Please ensure it is a valid attendance code and try again.');
    }
  };

  const handleError = (error: Error | string) => {
    console.error(error);
    setShowScanner(false);
    setScanStatus('error');
    if (typeof error === 'string' && error.includes('permission')) {
        setScanMessage('Camera permission denied. Please enable camera access in your browser settings to scan QR codes.');
    } else {
        setScanMessage('Could not access camera. Please ensure it is not being used by another application.');
    }
  };

  const resetScanner = () => {
    setShowScanner(true);
    setScanStatus('scanning');
    setScanMessage('Point your camera at a QR code to mark your attendance.');
  };

  const getStatusStyles = () => {
      switch (scanStatus) {
          case 'success': return { bg: 'bg-green-100', text: 'text-green-800', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' };
          case 'error': return { bg: 'bg-red-100', text: 'text-red-800', icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z' };
          case 'info': return { bg: 'bg-blue-100', text: 'text-blue-800', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' };
          default: return { bg: 'bg-slate-100', text: 'text-slate-800', icon: 'M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 1v4m0 0h-4m4 0l-5-5' };
      }
  };
  const { bg, text, icon } = getStatusStyles();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Scan Attendance QR Code</h1>

      <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center justify-center">
        {showScanner ? (
          <QRCodeScanner onScan={handleScan} onError={handleError} />
        ) : (
          <div className="w-full max-w-md text-center flex flex-col items-center justify-center min-h-[300px]">
            <svg className={`w-16 h-16 ${text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} />
            </svg>
             <h2 className={`mt-4 text-xl font-bold ${text}`}>
                {scanStatus.charAt(0).toUpperCase() + scanStatus.slice(1)}
            </h2>
            <button
                onClick={resetScanner}
                className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700 transition"
            >
                Scan Again
            </button>
          </div>
        )}
        
        <div className={`mt-6 p-4 rounded-md w-full max-w-md text-center ${bg} ${text} font-semibold`}>
          {scanMessage}
        </div>
      </div>
    </div>
  );
};

export default ScanView;
