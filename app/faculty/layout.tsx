"use client";
import { useState, ReactNode } from "react";
import Header from "../../components/Header";
import FacultySidebar from "@/components/sidebar/FacultySidebar";

interface FacultyLayoutProps {
  children: ReactNode;
}

export default function FacultyLayout({ children }: FacultyLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - pass all required props */}
      <FacultySidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-auto p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
