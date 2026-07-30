import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";

const INPUT_FILE = path.join(process.cwd(), "input.csv");
const OUTPUT_FILE = path.join(
  process.cwd(),
  "output",
  "procurement_transactions_import.csv"
);

// ----------------------------
// Helpers
// ----------------------------

function cleanCurrency(value: string) {
  if (!value) return "";

  return value
    .replace(/Rp/gi, "")
    .replace(/,/g, "")
    .replace(/\s/g, "")
    .trim();
}

function formatDate(value: string) {
  if (!value) return "";

  const months: Record<string, string> = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",
  };

  const parts = value.split("-");

  if (parts.length !== 3) return value;

  const day = parts[0].padStart(2, "0");
  const month = months[parts[1]];
  const year = parts[2];

  if (!month) return value;

  return `${year}-${month}-${day}`;
}

// ----------------------------
// Read CSV
// ----------------------------

const csv = fs.readFileSync(INPUT_FILE, "utf8");

const records = parse(csv, {
  columns: true,
  skip_empty_lines: true,
});

// ----------------------------
// Transform
// ----------------------------

const transformed = records.map((row: any) => {
  delete row.id;
  delete row.created_at;
  delete row.updated_at;
  delete row.synced_at;

  row.unit_price = cleanCurrency(row.unit_price);
  row.total_price = cleanCurrency(row.total_price);

  row.order_date = formatDate(row.order_date);
  row.receive_date = formatDate(row.receive_date);

  return row;
});

// ----------------------------
// Write CSV
// ----------------------------

const output = stringify(transformed, {
  header: true,
});

fs.mkdirSync(path.dirname(OUTPUT_FILE), {
  recursive: true,
});

fs.writeFileSync(OUTPUT_FILE, output);

console.log("");
console.log("======================================");
console.log("CSV berhasil dikonversi");
console.log("======================================");
console.log(OUTPUT_FILE);