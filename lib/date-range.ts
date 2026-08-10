export interface DateRange {
  startDate: Date;
  endDate: Date;
}

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function buildCurrentRange(
  year: number,
  months: number[]
): DateRange {
  if (months.length === 0) {
    return {
      startDate: new Date(year, 0, 1),
      endDate: new Date(year, 11, 31),
    };
  }

  const sorted = [...months].sort(
    (a, b) => a - b
  );

  validateMonths(sorted);

  const firstMonth = sorted[0];
  const lastMonth = sorted[sorted.length - 1];

  return {
    startDate: new Date(
      year,
      firstMonth - 1,
      1
    ),

    endDate: new Date(
      year,
      lastMonth,
      0
    ),
  };
}

export function buildPreviousRange(
  current: DateRange
): DateRange {
  const currentStartYear =
    current.startDate.getFullYear();

  const currentStartMonth =
    current.startDate.getMonth();

  const currentEndYear =
    current.endDate.getFullYear();

  const currentEndMonth =
    current.endDate.getMonth();

  const currentStartIndex =
    currentStartYear * 12 +
    currentStartMonth;

  const currentEndIndex =
    currentEndYear * 12 +
    currentEndMonth;

  const monthCount =
    currentEndIndex -
    currentStartIndex +
    1;

  const previousEnd =
    new Date(current.startDate);

  previousEnd.setDate(0);

  const previousStart =
    new Date(previousEnd);

  previousStart.setMonth(
    previousStart.getMonth() -
      monthCount +
      1
  );

  previousStart.setDate(1);

  return {
    startDate: previousStart,
    endDate: previousEnd,
  };
}

export function buildComparisonLabel(
  range: DateRange
): string {
  const start = range.startDate;
  const end = range.endDate;

  const startMonth =
    MONTH_NAMES[start.getMonth()];

  const endMonth =
    MONTH_NAMES[end.getMonth()];

  const startYear =
    start.getFullYear();

  const endYear =
    end.getFullYear();

  if (
    startMonth === endMonth &&
    startYear === endYear
  ) {
    return `${startMonth} ${startYear}`;
  }

  if (startYear === endYear) {
    return `${startMonth}–${endMonth} ${startYear}`;
  }

  return `${startMonth} ${startYear}–${endMonth} ${endYear}`;
}

export function formatDateOnly(
  date: Date
): string {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function validateMonths(
  months: number[]
): void {
  if (months.length <= 1) {
    return;
  }

  for (
    let i = 1;
    i < months.length;
    i++
  ) {
    if (
      months[i] !==
      months[i - 1] + 1
    ) {
      throw new Error(
        "Please select consecutive months."
      );
    }
  }
}