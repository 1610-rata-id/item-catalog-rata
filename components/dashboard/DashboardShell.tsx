import type { ReactNode } from "react";

import DashboardSidebar from "./DashboardSidebar";
import DashboardContent from "./DashboardContent";

interface DashboardShellProps {
  children: ReactNode;
}

export default function DashboardShell({
  children,
}: DashboardShellProps) {
  return (
    <div className="flex h-screen bg-[#F8FAFC] dark:bg-neutral-950">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Content */}
      <DashboardContent>
        {children}
      </DashboardContent>
    </div>
  );
}