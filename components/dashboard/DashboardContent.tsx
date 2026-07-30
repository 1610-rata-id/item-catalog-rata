import type { ReactNode } from "react";

interface DashboardContentProps {
  children: ReactNode;
}

export default function DashboardContent({
  children,
}: DashboardContentProps) {
  return (
    <main className="flex-1 overflow-y-auto">
      <div className="min-h-screen p-8">
        {children}
      </div>
    </main>
  );
}