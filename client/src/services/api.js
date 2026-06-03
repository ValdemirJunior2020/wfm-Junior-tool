// client/src/services/api.js

const GOOGLE_SHEET_WEB_APP_URL = import.meta.env.VITE_GOOGLE_SHEET_WEB_APP_URL;

function jsonp(url, timeout = 20000) {
  return new Promise((resolve, reject) => {
    const callbackName = `wfmJsonp_${Date.now()}_${Math.round(
      Math.random() * 100000
    )}`;

    const script = document.createElement("script");

    const separator = url.includes("?") ? "&" : "?";
    script.src = `${url}${separator}callback=${callbackName}`;
    script.async = true;

    const timer = window.setTimeout(() => {
      cleanup();
      reject(new Error("Google Sheet request timed out."));
    }, timeout);

    function cleanup() {
      window.clearTimeout(timer);
      delete window[callbackName];

      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    }

    window[callbackName] = (data) => {
      cleanup();
      resolve(data);
    };

    script.onerror = () => {
      cleanup();
      reject(new Error("Google Sheet JSONP script failed to load."));
    };

    document.body.appendChild(script);
  });
}

export async function getDashboardData() {
  if (!GOOGLE_SHEET_WEB_APP_URL) {
    throw new Error(
      "Missing VITE_GOOGLE_SHEET_WEB_APP_URL. Create client/.env and restart Vite."
    );
  }

  const url = new URL(GOOGLE_SHEET_WEB_APP_URL);
  url.searchParams.set("action", "dashboard");
  url.searchParams.set("_cacheBust", Date.now().toString());

  const data = await jsonp(url.toString());

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

export async function getQaEvaluationsData() {
  if (!GOOGLE_SHEET_WEB_APP_URL) {
    throw new Error(
      "Missing VITE_GOOGLE_SHEET_WEB_APP_URL. Create client/.env and restart Vite."
    );
  }

  const url = new URL(GOOGLE_SHEET_WEB_APP_URL);
  url.searchParams.set("action", "qaEvaluations");
  url.searchParams.set("_cacheBust", Date.now().toString());

  const data = await jsonp(url.toString());

  if (!data || data.ok === false) {
    throw new Error(data?.message || "Google Sheet returned invalid QA data.");
  }

  return {
    ok: true,
    source: data.source || "google-sheet",
    generatedAt: data.generatedAt || new Date().toISOString(),
    qaEvaluations: Array.isArray(data.qaEvaluations)
      ? data.qaEvaluations
      : [],
  };
}