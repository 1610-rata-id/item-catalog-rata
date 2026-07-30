/**
 * Membersihkan angka non-currency.
 *
 * Contoh:
 * "2,000"    -> 2000
 * "15"       -> 15
 * ""         -> null
 * null       -> null
 */
export function transformNumber(
  value: string | null | undefined
): number | null {
  if (!value) {
    return null;
  }

  const cleaned = value
    .replace(/,/g, "")
    .replace(/\s/g, "")
    .trim();

  if (cleaned === "") {
    return null;
  }

  const number = Number(cleaned);

  return Number.isNaN(number) ? null : number;
}