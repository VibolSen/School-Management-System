"use client";

import React, { useState, useEffect } from "react";
import FacultyDashboard from "@/components/FacultyDashboard";

const FacultyDashboardPage = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token"); 
    if (!token) return;

    fetch("/api/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.user) setLoggedInUser(data.user);
      })
      .catch(console.error);
  }, []);

  if (!loggedInUser) return <p>Loading...</p>;

  return <FacultyDashboard loggedInUser={loggedInUser} />;
};

export default FacultyDashboardPage;
