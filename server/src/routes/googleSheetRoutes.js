// server/src/routes/googleSheetRoutes.js

import express from "express";
import {
  getDashboardDataFromGoogleSheet,
  saveSavingsAuditToGoogleSheet,
} from "../services/googleSheetService.js";

const router = express.Router();

/**
 * GET /api/google-sheet/test
 * Tests if the Google Apps Script Web App is connected.
 */
router.get("/test", async (req, res) => {
  try {
    const data = await getDashboardDataFromGoogleSheet();

    if (!data) {
      return res.json({
        ok: false,
        connected: false,
        message:
          "Google Sheet Web App is not configured or did not return data. Check GOOGLE_SHEET_WEB_APP_URL.",
      });
    }

    return res.json({
      ok: true,
      connected: true,
      source: data.source || "google-sheet",
      message: "Google Sheet connection is working.",
      preview: {
        vendors: data.vendorSummary?.length || 0,
        agents: data.agents?.length || 0,
      },
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      connected: false,
      message: error.message,
    });
  }
});

/**
 * GET /api/google-sheet/dashboard
 * Returns dashboard data from Google Sheet.
 */
router.get("/dashboard", async (req, res) => {
  try {
    const data = await getDashboardDataFromGoogleSheet();

    if (!data) {
      return res.status(404).json({
        ok: false,
        message:
          "No Google Sheet data found. Confirm your Apps Script Web App URL is deployed and has doGet(e).",
      });
    }

    return res.json(data);
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
});

/**
 * POST /api/google-sheet/savings-audit
 * Saves savings audit data to Google Sheet.
 */
router.post("/savings-audit", async (req, res) => {
  try {
    const saved = await saveSavingsAuditToGoogleSheet(req.body);

    return res.json({
      ok: saved,
      saved,
      message: saved
        ? "Savings audit saved to Google Sheet."
        : "Savings audit was not saved. Check GOOGLE_SHEET_WEB_APP_URL and Apps Script doPost(e).",
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      saved: false,
      message: error.message,
    });
  }
});

export default router;