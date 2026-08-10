import ExcelJS from "exceljs";

export function styleWorksheet(
  sheet: ExcelJS.Worksheet,
  currencyColumns: number[] = []
) {
  sheet.views = [
    {
      state: "frozen",
      ySplit: 1,
    },
  ];

  const header = sheet.getRow(1);

  header.height = 24;

  header.eachCell((cell) => {
    cell.font = {
      bold: true,
      color: {
        argb: "FFFFFFFF",
      },
    };

    cell.alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "FF2563EB",
      },
    };

    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
      bottom: { style: "thin" },
    };
  });

  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;

    row.eachCell((cell, columnNumber) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
        bottom: { style: "thin" },
      };

      if (rowNumber % 2 === 0) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: {
            argb: "FFF8FAFC",
          },
        };
      }

      if (currencyColumns.includes(columnNumber)) {
        cell.numFmt = '"Rp" #,##0';
      }
    });
  });

  const columnCount = sheet.columnCount;

  if (columnCount > 0) {
    sheet.autoFilter = {
      from: {
        row: 1,
        column: 1,
      },
      to: {
        row: 1,
        column: columnCount,
      },
    };
  }
}