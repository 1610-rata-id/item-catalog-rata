import ExcelJS from "exceljs";

interface SummaryData {
  year: number;
  months: number[];
  vendors: string[];
  items: string[];

  overview: {
    total_spend: number;
    total_transactions: number;
    total_purchase_requests: number;
    total_purchase_orders: number;
    total_vendors: number;
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
    { width: 50 },
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

  // ======================
  // YEAR
  // ======================

  sheet.addRow([
    "Year",
    data.year,
  ]);

  // ======================
  // MONTHS
  // ======================

  sheet.addRow([
    "Months",
    data.months.length > 0
      ? data.months
          .sort((a, b) => a - b)
          .map((month) =>
            new Date(
              2000,
              month - 1,
              1
            ).toLocaleString(
              "en-US",
              { month: "short" }
            )
          )
          .join(", ")
      : "All Months",
  ]);

  // ======================
  // VENDORS
  // ======================

  sheet.addRow([
    "Vendors",
    data.vendors.length > 0
      ? data.vendors.join(", ")
      : "All Vendors",
  ]);

  // ======================
  // ITEMS
  // ======================

  sheet.addRow([
    "Items",
    data.items.length > 0
      ? data.items.join(", ")
      : "All Items",
  ]);

  sheet.addRow([]);

  // ======================
  // KPI SUMMARY
  // ======================

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
    data.overview.total_spend,
  ]);

  sheet.addRow([
    "Transactions",
    data.overview.total_transactions,
  ]);

  sheet.addRow([
    "Purchase Requests",
    data.overview.total_purchase_requests,
  ]);

  sheet.addRow([
    "Purchase Orders",
    data.overview.total_purchase_orders,
  ]);

  sheet.addRow([
    "Active Vendors",
    data.overview.total_vendors,
  ]);

  for (let i = 13; i <= 17; i++) {
    sheet.getCell(`B${i}`).numFmt =
      '"Rp" #,##0';
  }

  return sheet;
}