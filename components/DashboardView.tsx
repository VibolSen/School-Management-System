import React from "react";
import { Role } from "../types";
import AdministratorDashboard from "./admin/AdministratorDashboard";
import HRDashboard from "./HRDashboard";
import FacultyDashboard from "./FacultyDashboard";
import StudentDashboard from "./StudentDashboard";
import PlaceholderView from "./PlaceholderView";

interface DashboardViewProps {
  currentUserRole: Role;
}

const DashboardView: React.FC<DashboardViewProps> = ({ currentUserRole }) => {
  switch (currentUserRole) {
    case Role.ADMINISTRATOR:
      return <AdministratorDashboard />;
    case Role.HR:
      return <HRDashboard />;
    case Role.FACULTY:
      return <FacultyDashboard />;
    case Role.STUDENT:
      return <StudentDashboard />;
    default:
      return <PlaceholderView title="Dashboard Not Available" />;
  }
};

export default DashboardView;
