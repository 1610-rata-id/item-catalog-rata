import { AnalyticsService } from "@/services/analytics-service";

export default async function AnalyticsTestPage() {
  const service = new AnalyticsService();

  const vendors = await service.getVendorPerformance({
  year: 2026,
  months: [],
  vendor: null,
  search: "",
});

  return (
    <main className="p-8">
      <h1 className="mb-6 text-3xl font-bold">
        Vendor Performance Test
      </h1>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100 text-black">
            <th className="border p-2 text-left">Vendor</th>
            <th className="border p-2 text-right">Transactions</th>
            <th className="border p-2 text-right">Total Spend</th>
          </tr>
        </thead>

        <tbody>
          {vendors.slice(0, 10).map((vendor) => (
            <tr key={vendor.vendor_name}>
              <td className="border p-2">{vendor.vendor_name}</td>

              <td className="border p-2 text-right">
                {vendor.total_transactions}
              </td>

              <td className="border p-2 text-right">
                {vendor.total_spend.toLocaleString("id-ID")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}