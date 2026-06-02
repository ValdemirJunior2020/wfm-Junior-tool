// client/src/services/api.js

const GOOGLE_SHEET_WEB_APP_URL = import.meta.env.VITE_GOOGLE_SHEET_WEB_APP_URL;

export async function getDashboardData() {
  if (!GOOGLE_SHEET_WEB_APP_URL) {
    throw new Error(
      "Missing VITE_GOOGLE_SHEET_WEB_APP_URL. Create client/.env and restart Vite."
    );
  }

  const url = new URL(GOOGLE_SHEET_WEB_APP_URL);
  url.searchParams.set("action", "dashboard");
  url.searchParams.set("_cacheBust", Date.now().toString());

  const response = await fetch(url.toString(), {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Google Sheet request failed with status ${response.status}`);
  }

  const data = await response.json();

  if (!data || data.ok === false) {
    throw new Error(data?.message || "Google Sheet returned invalid data.");
  }

  return {
    ok: true,
    source: data.source || "google-sheet",
    generatedAt: data.generatedAt || new Date().toISOString(),
    vendorSummary: Array.isArray(data.vendorSummary) ? data.vendorSummary : [],
    agents: Array.isArray(data.agents) ? data.agents : [],
  };
}