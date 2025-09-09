"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import QRCode from "qrcode";

const QR_CODE_EXPIRATION_SECONDS = 120; // 2 minutes

const QRCodeGeneratorModal = ({
  isOpen,
  onClose,
  course,
  checkedInStudents, // Now directly used from state passed from parent
  totalStudents,
  currentUserId,
  onQrSessionCreated,
  activeQrSessionId, // Receive the active session ID from parent
  setLiveCheckedInStudents, // Function to update checked-in students in parent
}) => {
  const canvasRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState(QR_CODE_EXPIRATION_SECONDS);
  const [qrCodeSession, setQrCodeSession] = useState(null); // State for the created QR session
  const intervalRef = useRef(null);

  // Function to generate a random QR code string
  const generateRandomQrCodeString = () => {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  };

  // 1. Create QR Code Session on modal open
  useEffect(() => {
    const createQrSession = async () => {
      if (isOpen && course && currentUserId && !qrCodeSession) {
        const qrCodeString = generateRandomQrCodeString();
        const expiresAt = new Date(
          Date.now() + QR_CODE_EXPIRATION_SECONDS * 1000
        ).toISOString();

        try {
          const res = await fetch("/api/qrcode-sessions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              courseId: course.id,
              createdById: currentUserId,
              qrCode: qrCodeString,
              expiresAt: expiresAt,
            }),
          });

          if (!res.ok)
            throw new Error(
              `Failed to create QR code session: ${res.statusText}`
            );

          const newSession = await res.json();
          setQrCodeSession(newSession);
          onQrSessionCreated(newSession.id); // Notify parent of the new session ID

          // Generate QR code image with the actual session ID
          QRCode.toCanvas(
            canvasRef.current,
            newSession.id, // Embed the session ID for students to scan
            { width: 256, errorCorrectionLevel: "H" },
            (error) => {
              if (error) console.error("Error generating QR code:", error);
            }
          );

          // Start the client-side timer
          setTimeLeft(QR_CODE_EXPIRATION_SECONDS);
          intervalRef.current = setInterval(() => {
            setTimeLeft((prevTime) => {
              if (prevTime <= 1) {
                clearInterval(intervalRef.current);
                return 0;
              }
              return prevTime - 1;
            });
          }, 1000);
        } catch (error) {
          console.error(
            "Error creating QR session or generating QR code:",
            error
          );
          // Handle error, maybe close modal or show an error message
          onClose();
        }
      }
    };

    createQrSession();

    // Cleanup on unmount or close
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      setQrCodeSession(null); // Reset session state on close
      setTimeLeft(QR_CODE_EXPIRATION_SECONDS); // Reset timer
    };
  }, [isOpen, course, currentUserId, onQrSessionCreated]); // Dependencies for session creation

  // 2. Fetch live check-ins for the active QR session
  useEffect(() => {
    let checkInPollInterval;
    if (isOpen && activeQrSessionId && timeLeft > 0) {
      const fetchLiveCheckIns = async () => {
        try {
          const res = await fetch(
            `/api/attendances?qrCodeSessionId=${activeQrSessionId}`
          );
          if (!res.ok)
            throw new Error(
              `Failed to fetch live attendances: ${res.statusText}`
            );
          const data = await res.json();
          // Filter to only include checked-in students (e.g., status is 'Present')
          // You'll need to adjust this based on your actual Attendance model and status names
          const presentStudents = data.filter(
            (att) => att.status?.name === "Present" || att.status === "Present"
          ); // Assuming 'Present' is a status name or the direct status field
          const studentIds = presentStudents.map((att) => att.studentId);

          // Fetch student details for the checked-in IDs
          const studentDetailsPromises = studentIds.map((id) =>
            fetch(`/api/users?id=${id}`).then((res) => res.json())
          );
          const studentDetails = await Promise.all(studentDetailsPromises);
          setLiveCheckedInStudents(studentDetails.filter((s) => s)); // Filter out any null/undefined
        } catch (error) {
          console.error("Error fetching live check-ins:", error);
        }
      };

      // Poll for new check-ins every few seconds
      checkInPollInterval = setInterval(fetchLiveCheckIns, 5000); // Poll every 5 seconds
    } else if (checkInPollInterval) {
      clearInterval(checkInPollInterval);
    }

    return () => {
      if (checkInPollInterval) {
        clearInterval(checkInPollInterval);
      }
    };
  }, [isOpen, activeQrSessionId, timeLeft, setLiveCheckedInStudents]); // Dependencies for polling

  const isExpired = timeLeft <= 0;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  if (!isOpen || !course) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="qr-modal-title"
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm text-center animate-fade-in-scale">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2
              id="qr-modal-title"
              className="text-xl font-bold text-slate-800"
            >
              Live Attendance
            </h2>
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-slate-800"
              aria-label="Close modal"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="p-6 flex flex-col items-center">
          <p className="font-semibold text-slate-700">{course.title}</p>{" "}
          {/* Use course.title */}
          <p className="text-sm text-slate-500 mb-4">
            Students can scan this code to mark their attendance.
          </p>
          <div
            className={`relative inline-block p-4 bg-slate-100 rounded-lg ${
              isExpired || !qrCodeSession ? "opacity-20" : "" // Grey out if expired or no session yet
            }`}
          >
            <canvas ref={canvasRef} />
            {(isExpired || !qrCodeSession) && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80">
                <span className="px-4 py-2 text-lg font-bold text-white bg-red-600 rounded-md">
                  {isExpired ? "EXPIRED" : "GENERATING..."}
                </span>
              </div>
            )}
          </div>
          <div className="mt-4">
            {isExpired ? (
              <p className="text-red-600 font-bold text-lg">
                This QR code has expired.
              </p>
            ) : (
              <p className="text-slate-600">
                Code expires in:{" "}
                <span className="font-bold text-blue-600 text-lg">{`${minutes}:${
                  seconds < 10 ? "0" : ""
                }${seconds}`}</span>
              </p>
            )}
          </div>
          <div className="mt-6 w-full">
            <div className="flex justify-between items-center text-sm font-semibold text-slate-600 mb-1 px-1">
              <span>Checked In</span>
              <span>
                {checkedInStudents.length} / {totalStudents}
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                style={{
                  width: `${
                    totalStudents > 0
                      ? (checkedInStudents.length / totalStudents) * 100
                      : 0
                  }%`,
                }}
              ></div>
            </div>
            <div className="mt-3 bg-slate-50 border rounded-lg max-h-36 overflow-y-auto text-left">
              {checkedInStudents.length > 0 ? (
                <ul className="divide-y divide-slate-200">
                  {checkedInStudents.map((student) => (
                    <li
                      key={student.id}
                      className="px-4 py-2 text-sm text-slate-800"
                    >
                      {student.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-6 text-center">
                  <p className="text-sm text-slate-500">
                    Waiting for students to check in...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="p-4 bg-slate-50 border-t rounded-b-xl">
          <button
            type="button"
            onClick={onClose}
            className="w-full px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            End Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGeneratorModal;
