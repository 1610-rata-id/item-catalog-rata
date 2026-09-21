import ExcelJS from "exceljs";

import { createSummarySheet } from "./summary-sheet";
import { styleWorksheet } from "./excel-style";

import { MonthlySpend } from "@/types/monthly-spend";
import { TopSpendItem } from "@/types/top-spend-item";
import { TopVendor } from "@/types/top-vendor";
import { RecentTransaction } from "@/types/recent-transaction";
import { DashboardOverview } from "@/types/dashboard-overview";

interface ExcelReportData {
  filters: {
    year: number;
    months: number[];
    vendors: string[];
    items: string[];
  };

  overview: DashboardOverview;

  monthlySpend: MonthlySpend[];

  topItems: TopSpendItem[];

  topVendors: TopVendor[];

  recentTransactions: RecentTransaction[];
}

export async function generateExcelReport(
  data: ExcelReportData
) {
  const workbook = new ExcelJS.Workbook();

  workbook.creator = "ITEM CATALOG RATA";
  workbook.created = new Date();

  createSummarySheet(workbook, {
    year: data.filters.year,
    months: data.filters.months,
    vendors: data.filters.vendors,
    items: data.filters.items,
    overview: data.overview,
  });

  const totalSpend =
    Number(data.overview.total_spend ?? 0);

  const safeTotalSpend =
    totalSpend > 0 ? totalSpend : 1;

  // ======================
  // MONTHLY SPEND
  // ======================

  const monthlySheet =
    workbook.addWorksheet("Monthly Spend");

  monthlySheet.columns = [
    {
      header: "Month",
      key: "month",
      width: 20,
    },
    {
      header: "Spend",
      key: "spend",
      width: 22,
    },
  ];

  data.monthlySpend.forEach((row) => {
    monthlySheet.addRow({
      month: row.month_name,
      spend: row.total_spend,
    });
  });

  styleWorksheet(monthlySheet, [2]);

  // ======================
  // TOP ITEMS
  // ======================

  const itemSheet =
    workbook.addWorksheet("Top Items");

  itemSheet.columns = [
    {
      header: "Rank",
      key: "rank",
      width: 8,
    },
    {
      header: "Item",
      key: "item",
      width: 40,
    },
    {
      header: "Qty",
      key: "qty",
      width: 12,
    },
    {
      header: "Spend",
      key: "spend",
      width: 20,
    },
    {
      header: "Contribution %",
      key: "contribution",
      width: 18,
    },
    {
      header: "Transactions",
      key: "transactions",
      width: 16,
    },
  ];

  data.topItems.forEach((item, index) => {
    const contribution =
      Number(item.total_spend) /
      safeTotalSpend;

    itemSheet.addRow({
      rank: index + 1,
      item: item.item_name,
      qty: item.total_qty,
      spend: item.total_spend,
      contribution,
      transactions:
        item.transaction_count,
    });
  });

  itemSheet.eachRow((row, index) => {
    if (index === 1) return;

    row.getCell(4).numFmt =
      '"Rp" #,##0';

    row.getCell(5).numFmt =
      "0.00%";
  });

  styleWorksheet(itemSheet, [4]);

  // ======================
  // TOP VENDORS
  // ======================

  const vendorSheet =
    workbook.addWorksheet("Top Vendors");

  vendorSheet.columns = [
    {
      header: "Rank",
      key: "rank",
      width: 8,
    },
    {
      header: "Vendor",
      key: "vendor",
      width: 42,
    },
    {
      header: "Spend",
      key: "spend",
      width: 20,
    },
    {
      header: "Contribution %",
      key: "contribution",
      width: 18,
    },
    {
      header: "Transactions",
      key: "transactions",
      width: 16,
    },
    {
      header: "Unique Items",
      key: "items",
      width: 16,
    },
  ];

  data.topVendors.forEach((vendor, index) => {
    const contribution =
      Number(vendor.total_spend) /
      safeTotalSpend;

    vendorSheet.addRow({
      rank: index + 1,
      vendor: vendor.vendor_name,
      spend: vendor.total_spend,
      contribution,
      transactions:
        vendor.transaction_count,
      items:
        vendor.unique_items,
    });
  });

  vendorSheet.eachRow((row, index) => {
    if (index === 1) return;

    row.getCell(3).numFmt =
      '"Rp" #,##0';

    row.getCell(4).numFmt =
      "0.00%";
  });

  styleWorksheet(vendorSheet, [3]);

  // ======================
  // TRANSACTIONS
  // ======================

  const trxSheet =
    workbook.addWorksheet("Transactions");

  trxSheet.columns = [
    {
      header: "Order Date",
      key: "date",
      width: 18,
    },
    {
      header: "Vendor",
      key: "vendor",
      width: 38,
    },
    {
      header: "Item",
      key: "item",
      width: 42,
    },
    {
      header: "UOM",
      key: "uom",
      width: 10,
    },
    {
      header: "Qty",
      key: "qty",
      width: 12,
    },
    {
      header: "Total Price",
      key: "total",
      width: 18,
    },
    {
      header: "PO Number",
      key: "po",
      width: 20,
    },
    {
      header: "PR Number",
      key: "pr",
      width: 20,
    },
  ];

  data.recentTransactions.forEach((trx) => {
    trxSheet.addRow({
      date: trx.order_date,
      vendor: trx.vendor_name,
      item: trx.item_name,
      uom: trx.uom,
      qty: trx.qty,
      total: trx.total_price,
      po: trx.po_number,
      pr: trx.pr_number,
    });
  });

  trxSheet.eachRow((row, index) => {
    if (index === 1) return;

    row.getCell(6).numFmt =
      '"Rp" #,##0';
  });

  styleWorksheet(trxSheet, [6]);

  return workbook;
}