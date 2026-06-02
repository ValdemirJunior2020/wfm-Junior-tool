// server/src/services/googleSheetService.js

const GOOGLE_SHEET_WEB_APP_URL = process.env.GOOGLE_SHEET_WEB_APP_URL || "";
const GOOGLE_SHEET_API_KEY = process.env.GOOGLE_SHEET_API_KEY || "";

export async function getDashboardDataFromGoogleSheet() {
  if (!GOOGLE_SHEET_WEB_APP_URL) {
    return null;
  }

  try {
    const url = new URL(GOOGLE_SHEET_WEB_APP_URL);
    url.searchParams.set("action", "dashboard");

    if (GOOGLE_SHEET_API_KEY) {
      url.searchParams.set("apiKey", GOOGLE_SHEET_API_KEY);
    }

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`Google Sheet request failed: ${response.status}`);
    }

    const data = await response.json();

    if (!data || data.ok === false) {
      return null;
    }

    return data;
  } catch (error) {
    console.warn("Google Sheet fetch failed:", error.message);
    return null;
  }
}

export async function saveSavingsAuditToGoogleSheet(payload) {
  if (!GOOGLE_SHEET_WEB_APP_URL) {
    return false;
  }

  try {
    const response = await fetch(GOOGLE_SHEET_WEB_APP_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify({
        action: "saveSavingsAudit",
        apiKey: GOOGLE_SHEET_API_KEY,
        payload,
      }),
    });

    if (!response.ok) {
      throw new Error(`Google Sheet save failed: ${response.status}`);
    }

    const data = await response.json();
    return Boolean(data.ok);
  } catch (error) {
    console.warn("Google Sheet save failed:", error.message);
    return false;
  }
}