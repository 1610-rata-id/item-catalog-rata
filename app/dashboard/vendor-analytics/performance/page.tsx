import PerformancePage from "@/components/analytics/performance/page";

interface PageProps {
  searchParams: Promise<{
    year?: string;
    month?: string;
    vendors?: string;
    items?: string;
  }>;
}

export default function Page({
  searchParams,
}: PageProps) {
  return (
    <PerformancePage
      searchParams={searchParams}
    />
  );
}