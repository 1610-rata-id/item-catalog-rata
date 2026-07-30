const API_URL = process.env.NEXT_PUBLIC_ANALYTICS_API!;

export async function fetchTransactions() {
  const response = await fetch(API_URL, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch Analytics API.");
  }

  return response.json();
}
