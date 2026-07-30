import { TopVendor } from "@/types/top-vendor";

import DashboardCard from "../shared/DashboardCard";
import SectionHeader from "../shared/SectionHeader";
import TopVendorChart from "../charts/TopVendorChart";

interface TopVendorCardProps {
  topVendors: TopVendor[];
}

export default function TopVendorCard({
  topVendors,
}: TopVendorCardProps) {
  return (
    <DashboardCard>
      <SectionHeader
        title="Top 10 Vendors"
        description="Vendors with the highest procurement spend."
      />

      <TopVendorChart
  topVendors={topVendors}
/>
    </DashboardCard>
  );
}