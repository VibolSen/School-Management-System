"use client";

import React, { useState } from "react";
import LeaveRequestTable from "@/components/leave/LeaveRequestTable";
import RequestLeaveModal from "@/components/leave/RequestLeaveModal";
import ConfirmationModal from "@/components/e-library/ConfirmationModal";
import { MOCK_LEAVE_REQUESTS, MOCK_STAFF_DATA } from "@/lib/constants";
import type { LeaveRequest } from "@/lib/types";
import { LeaveRequestStatus, Role } from "@/lib/types";
import { useUser } from "@/context/UserContext";

type ConfirmationInfo = {
  action: "approve" | "reject";
  request: LeaveRequest;
};

const LeaveManagementView: React.FC = () => {
  const { user } = useUser();

  const [leaveRequests, setLeaveRequests] =
    useState<LeaveRequest[]>(MOCK_LEAVE_REQUESTS);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [confirmationInfo, setConfirmationInfo] =
    useState<ConfirmationInfo | null>(null);

  if (!user) {
    return <p className="text-slate-500">Loading user information...</p>;
  }

  const currentUserRole: Role = user.role as Role; // safe because user exists

  const handleApplyClick = () => {
    setIsRequestModalOpen(true);
  };

  const handleCloseRequestModal = () => {
    setIsRequestModalOpen(false);
  };

  const handleSaveRequest = (
    newRequestData: Omit<
      LeaveRequest,
      "id" | "staffId" | "staffName" | "status" | "requestDate"
    >
  ) => {
    const currentUser =
      MOCK_STAFF_DATA.find((s) => s.role === currentUserRole) ||
      MOCK_STAFF_DATA[0];

    const newRequest: LeaveRequest = {
      id: `LR${(leaveRequests.length + 1).toString().padStart(3, "0")}`,
      staffId: currentUser.id,
      staffName: currentUser.name,
      status: LeaveRequestStatus.PENDING,
      requestDate: new Date().toISOString().split("T")[0],
      ...newRequestData,
    };
    setLeaveRequests((prev) =>
      [newRequest, ...prev].sort(
        (a, b) =>
          new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()
      )
    );
    handleCloseRequestModal();
  };

  const handleApprove = (request: LeaveRequest) => {
    setConfirmationInfo({ action: "approve", request });
  };

  const handleReject = (request: LeaveRequest) => {
    setConfirmationInfo({ action: "reject", request });
  };

  const handleConfirmAction = () => {
    if (!confirmationInfo) return;

    const { action, request } = confirmationInfo;
    const newStatus =
      action === "approve"
        ? LeaveRequestStatus.APPROVED
        : LeaveRequestStatus.REJECTED;

    setLeaveRequests((prev) =>
      prev.map((r) => (r.id === request.id ? { ...r, status: newStatus } : r))
    );
    setConfirmationInfo(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Leave Management
          </h1>
          <p className="text-slate-500">
            Track and manage all staff leave requests.
          </p>
        </div>
        <button
          onClick={handleApplyClick}
          className="w-full md:w-auto bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 transition"
        >
          Apply for Leave
        </button>
      </div>

      <LeaveRequestTable
        requests={leaveRequests}
        currentUserRole={currentUserRole}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      <RequestLeaveModal
        isOpen={isRequestModalOpen}
        onClose={handleCloseRequestModal}
        onSaveRequest={handleSaveRequest}
      />

      <ConfirmationModal
        isOpen={!!confirmationInfo}
        onClose={() => setConfirmationInfo(null)}
        onConfirm={handleConfirmAction}
        title={`${
          confirmationInfo?.action === "approve" ? "Approve" : "Reject"
        } Leave Request`}
        message={
          <p>
            Are you sure you want to {confirmationInfo?.action} the leave
            request for <strong>{confirmationInfo?.request.staffName}</strong>?
          </p>
        }
        confirmText={
          confirmationInfo?.action === "approve" ? "Approve" : "Reject"
        }
        variant={confirmationInfo?.action === "approve" ? "success" : "danger"}
      />
    </div>
  );
};

export default LeaveManagementView;
