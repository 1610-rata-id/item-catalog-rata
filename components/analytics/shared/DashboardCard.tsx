import { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import SectionHeader from "./SectionHeader";

interface DashboardCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}

export default function DashboardCard({
  title,
  description,
  children,
  action,
  className,
}: DashboardCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <SectionHeader
          title={title}
          description={description}
          action={action}
        />
      </CardHeader>

      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}