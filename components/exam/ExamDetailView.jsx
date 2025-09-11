// pages/index.js
"use client";
import Head from 'next/head';
import { useState, useEffect } from 'react';
import AddExamModal from './AddExamModal'; // import the modal component

export default function ExamManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("/api/courses");
        const data = await res.json();
        setCourses(Array.isArray(data) ? data : []);
      } catch {
        setCourses([]);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <Head>
        <title>Exam Management</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <div className="flex justify-between items-center mb-8 px-4 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Exam Management</h1>
          <p className="text-gray-600">Create, schedule, and grade exams for your courses.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-300"
        >
          Create Exam
        </button>
      </div>

      {/* Course Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 mx-4 sm:mx-6 lg:mx-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">World History</h2>
        {/* Exam Card */}
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div>
            <p className="text-lg font-medium text-gray-700">Final Exam: Ancient Civilizations</p>
            <p className="text-sm text-gray-500">Date: 10/10/2025 at 14:00</p>
          </div>
        </div>
      </div>

      {/* AddExamModal */}
      <AddExamModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} courses={courses} />
    </div>
  );
}
