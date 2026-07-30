interface DashboardHeaderProps {
  title: string;
  description: string;
}

export default function DashboardHeader({
  title,
  description,
}: DashboardHeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold tracking-tight">
        {title}
      </h1>

      <p className="mt-1 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}