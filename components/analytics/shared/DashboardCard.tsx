import { ReactNode } from "react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface DashboardCardProps {
  children: ReactNode;
  className?: string;
}

export default function DashboardCard({
  children,
  className,
}: DashboardCardProps) {
  return (
    <Card className={className}>
      <CardContent className="p-6">
        {children}
      </CardContent>
    </Card>
  );
}