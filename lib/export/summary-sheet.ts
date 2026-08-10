import ExcelJS from "exceljs";

interface SummaryData {
  year: number;
  month: number | null;
  vendor: string | null;
  search: string;

  overview: {
    totalSpend: number;
    totalTransactions: number;
    totalPurchaseRequests: number;
    totalPurchaseOrders: number;
    totalVendors: number;
  };
}

export function createSummarySheet(
  workbook: ExcelJS.Workbook,
  data: SummaryData
) {
  const sheet =
    workbook.addWorksheet("Summary");

  sheet.columns = [
    { width: 28 },
    { width: 30 },
  ];

  sheet.mergeCells("A1:B1");

  const title = sheet.getCell("A1");

  title.value =
    "PROCUREMENT ANALYTICS REPORT";

  title.font = {
    bold: true,
    size: 20,
    color: {
      argb: "FFFFFFFF",
    },
  };

  title.alignment = {
    horizontal: "center",
    vertical: "middle",
  };

  title.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: {
      argb: "FF2563EB",
    },
  };

  sheet.getRow(1).height = 34;

  sheet.addRow([]);

  sheet.addRow([
    "Generated",
    new Date().toLocaleString("id-ID"),
  ]);

  sheet.addRow([]);

  sheet.addRow(["FILTER"]);

  sheet.getCell("A5").font = {
    bold: true,
  };

  sheet.addRow([
    "Year",
    data.year,
  ]);

  sheet.addRow([
    "Month",
    data.month ?? "All Months",
  ]);

  sheet.addRow([
    "Vendor",
    data.vendor ?? "All Vendors",
  ]);

  sheet.addRow([
    "Search",
    data.search || "-",
  ]);

  sheet.addRow([]);

  sheet.addRow([
    "KPI SUMMARY",
  ]);

  sheet.getCell("A11").font = {
    bold: true,
  };

  const header = sheet.addRow([
    "Metric",
    "Value",
  ]);

  header.eachCell((cell) => {
    cell.font = {
      bold: true,
      color: {
        argb: "FFFFFFFF",
      },
    };

    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "FF2563EB",
      },
    };

    cell.border = {
      top: {
        style: "thin",
      },
      left: {
        style: "thin",
      },
      right: {
        style: "thin",
      },
      bottom: {
        style: "thin",
      },
    };
  });

  sheet.addRow([
    "Total Spend",
    data.overview.totalSpend,
  ]);

  sheet.addRow([
    "Transactions",
    data.overview.totalTransactions,
  ]);

  sheet.addRow([
    "Purchase Requests",
    data.overview.totalPurchaseRequests,
  ]);

  sheet.addRow([
    "Purchase Orders",
    data.overview.totalPurchaseOrders,
  ]);

  sheet.addRow([
    "Active Vendors",
    data.overview.totalVendors,
  ]);

  for (let i = 13; i <= 17; i++) {
    sheet.getCell(`B${i}`).numFmt =
      '"Rp" #,##0';
  }

  return sheet;
}