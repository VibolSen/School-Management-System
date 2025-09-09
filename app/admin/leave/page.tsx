"use client";

import { UserProvider } from "@/context/UserContext";
import LeaveManagementView from "@/components/leave/LeaveManagementView";

export default function LeavePage() {
  return (
    <UserProvider>
      <LeaveManagementView />
    </UserProvider>
  );
}
