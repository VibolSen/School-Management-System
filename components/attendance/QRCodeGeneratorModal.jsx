'use client';

import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';

const QR_CODE_EXPIRATION_SECONDS = 120; // 2 minutes

const QRCodeGeneratorModal = ({ isOpen, onClose, course, checkedInStudents, totalStudents }) => {
  const canvasRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState(QR_CODE_EXPIRATION_SECONDS);
  
  useEffect(() => {
    if (isOpen && course) {
      // Reset timer on open
      setTimeLeft(QR_CODE_EXPIRATION_SECONDS);

      const qrData = JSON.stringify({
        courseId: course.id,
        timestamp: Date.now(),
      });

      QRCode.toCanvas(canvasRef.current, qrData, { width: 256, errorCorrectionLevel: 'H' }, (error) => {
        if (error) console.error('Error generating QR code:', error);
      });
      
      const timer = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOpen, course]);

  if (!isOpen || !course) return null;

  const isExpired = timeLeft <= 0;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" role="dialog" aria-modal="true" aria-labelledby="qr-modal-title">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm text-center animate-fade-in-scale">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 id="qr-modal-title" className="text-xl font-bold text-slate-800">
              Live Attendance
            </h2>
            <button onClick={onClose} className="text-slate-500 hover:text-slate-800" aria-label="Close modal">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="p-6 flex flex-col items-center">
            <p className="font-semibold text-slate-700">{course.name}</p>
            <p className="text-sm text-slate-500 mb-4">Students can scan this code to mark their attendance.</p>

            <div className={`relative inline-block p-4 bg-slate-100 rounded-lg ${isExpired ? 'opacity-20' : ''}`}>
                 <canvas ref={canvasRef} />
                 {isExpired && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80">
                        <span className="px-4 py-2 text-lg font-bold text-white bg-red-600 rounded-md">EXPIRED</span>
                    </div>
                 )}
            </div>

            <div className="mt-4">
                {isExpired ? (
                    <p className="text-red-600 font-bold text-lg">This QR code has expired.</p>
                ) : (
                    <p className="text-slate-600">
                        Code expires in: <span className="font-bold text-blue-600 text-lg">{`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`}</span>
                    </p>
                )}
            </div>

            <div className="mt-6 w-full">
                <div className="flex justify-between items-center text-sm font-semibold text-slate-600 mb-1 px-1">
                    <span>Checked In</span>
                    <span>{checkedInStudents.length} / {totalStudents}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${totalStudents > 0 ? (checkedInStudents.length / totalStudents) * 100 : 0}%` }}></div>
                </div>
                <div className="mt-3 bg-slate-50 border rounded-lg max-h-36 overflow-y-auto text-left">
                    {checkedInStudents.length > 0 ? (
                        <ul className="divide-y divide-slate-200">
                            {checkedInStudents.map(student => (
                                <li key={student.id} className="px-4 py-2 text-sm text-slate-800">
                                    {student.name}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-6 text-center">
                            <p className="text-sm text-slate-500">Waiting for students to check in...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
        <div className="p-4 bg-slate-50 border-t rounded-b-xl">
            <button type="button" onClick={onClose} className="w-full px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                End Session
            </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGeneratorModal;
