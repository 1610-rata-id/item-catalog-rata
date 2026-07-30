/**
 * Membersihkan format mata uang menjadi angka.
 *
 * Contoh:
 * "Rp 3,500"       -> 3500
 * "Rp30,000"       -> 30000
 * "3,500"          -> 3500
 * ""               -> null
 * null             -> null
 */
export function transformCurrency(
  value: string | null | undefined
): number | null {
  if (!value) {
    return null;
  }

  const cleaned = value
    .replace(/Rp/gi, "")
    .replace(/,/g, "")
    .replace(/\s/g, "")
    .trim();

  if (cleaned === "") {
    return null;
  }

  const number = Number(cleaned);

  return Number.isNaN(number) ? null : number;
}