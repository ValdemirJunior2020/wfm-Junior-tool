// server/src/routes/savingsRoutes.js

import express from "express";
import { getPrisma } from "../services/prisma.js";
import {
  calculateEstimatedSavings,
  buildMockDashboardData,
} from "../utils/mockDashboardData.js";
import { saveSavingsAuditToGoogleSheet } from "../services/googleSheetService.js";

const router = express.Router();

/**
 * POST /api/savings/calculate
 * Calculates estimated monthly and annual savings.
 */
router.post("/calculate", async (req, res) => {
  try {
    const result = calculateEstimatedSavings(req.body);

    return res.json({
      ok: true,
      source: "calculation-engine",
      ...result,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: error.message,
    });
  }
});

/**
 * POST /api/savings/audit
 * Saves savings calculation to Google Sheet if configured.
 * If Prisma is enabled, it can also save to PostgreSQL.
 */
router.post("/audit", async (req, res) => {
  try {
    const result = calculateEstimatedSavings(req.body);

    const savedToSheet = await saveSavingsAuditToGoogleSheet({
      ...req.body,
      ...result,
    });

    const prisma = await getPrisma();

    let savedToDatabase = false;

    if (prisma) {
      try {
        await prisma.savingsAudit.create({
          data: {
            vendor: result.vendor,
            currentBilledAgents: result.currentBilledAgents,
            optimizedRequiredAgents: result.optimizedRequiredAgents,
            agentGap: result.agentGap,
            avgHourlyRate: result.avgHourlyRate,
            monthlyBillableHoursPerAgent: result.monthlyBillableHoursPerAgent,
            estimatedMonthlySavings: result.estimatedMonthlySavings,
            estimatedAnnualSavings: result.estimatedAnnualSavings,
            createdBy: req.body.createdBy || "Dashboard Demo",
            assumptionsJson: JSON.stringify(req.body),
          },
        });

        savedToDatabase = true;
      } catch (databaseError) {
        console.warn("Database audit save skipped:", databaseError.message);
      }
    }

    return res.json({
      ok: true,
      source: savedToSheet
        ? "google-sheet"
        : savedToDatabase
          ? "postgres-prisma"
          : "calculation-only",
      savedToSheet,
      savedToDatabase,
      message: savedToSheet
        ? "Savings audit saved to Google Sheet."
        : "Savings audit calculated. Google Sheet save was not configured or failed.",
      ...result,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
});

/**
 * GET /api/savings/summary
 * Returns vendor savings summary.
 */
router.get("/summary", async (req, res) => {
  try {
    const prisma = await getPrisma();

    if (prisma) {
      const rows = await prisma.vendorMetric.findMany({
        orderBy: {
          vendor: "asc",
        },
      });

      return res.json({
        ok: true,
        source: "postgres-prisma",
        savingsSummary: rows.map((item) => ({
          vendor: item.vendor,
          currentBilledAgents: item.currentBilledAgents,
          optimizedRequiredAgents: item.optimizedRequiredAgents,
          agentGap: item.currentBilledAgents - item.optimizedRequiredAgents,
          avgHourlyRate: Number(item.avgHourlyRate),
          monthlySavings: Number(item.monthlySavings),
          annualSavings: Number(item.monthlySavings) * 12,
        })),
      });
    }

    const mockData = buildMockDashboardData();

    return res.json({
      ok: true,
      source: "mock-data",
      savingsSummary: mockData.vendorSummary.map((item) => ({
        vendor: item.vendor,
        currentBilledAgents: item.currentBilledAgents,
        optimizedRequiredAgents: item.optimizedRequiredAgents,
        agentGap: item.currentBilledAgents - item.optimizedRequiredAgents,
        avgHourlyRate: item.avgHourlyRate,
        monthlySavings: item.monthlySavings,
        annualSavings: item.monthlySavings * 12,
      })),
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
});

export default router;