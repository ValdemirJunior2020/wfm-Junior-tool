// server/src/routes/dashboardRoutes.js

import express from "express";
import { getPrisma } from "../services/prisma.js";
import {
  getDashboardDataFromGoogleSheet,
  saveSavingsAuditToGoogleSheet,
} from "../services/googleSheetService.js";
import {
  buildMockDashboardData,
  calculateEstimatedSavings,
} from "../utils/mockDashboardData.js";

const router = express.Router();

router.get("/health", (req, res) => {
  res.json({
    ok: true,
    message: "WFM Dashboard API is running",
    mode: process.env.USE_PRISMA === "true" ? "prisma" : "google-sheet-client/mock",
  });
});

router.get("/dashboard", async (req, res) => {
  try {
    const sheetData = await getDashboardDataFromGoogleSheet();

    if (sheetData && sheetData.ok) {
      return res.json(sheetData);
    }

    const prisma = await getPrisma();

    if (prisma) {
      const vendors = await prisma.vendorMetric.findMany({
        orderBy: {
          vendor: "asc",
        },
      });

      const agents = await prisma.agent.findMany({
        include: {
          timeLogs: {
            take: 1,
            orderBy: {
              workDate: "desc",
            },
          },
        },
        take: 400,
      });

      return res.json({
        ok: true,
        source: "postgres-prisma",
        generatedAt: new Date().toISOString(),
        vendorSummary: vendors.map((item) => ({
          vendor: item.vendor,
          currentBilledAgents: item.currentBilledAgents,
          optimizedRequiredAgents: item.optimizedRequiredAgents,
          avgHourlyRate: Number(item.avgHourlyRate),
          unproductiveShrinkageHours: Number(item.unproductiveShrinkageHours || 0),
          costPerCall: Number(item.costPerCall),
          qaScore: Number(item.qaScore),
          fcrScore: Number(item.fcrScore),
          monthlyWaste: Number(item.monthlyWaste),
          monthlySavings: Number(item.monthlySavings),
          monthlyCallVolume: Number(item.monthlyCallVolume),
          ahtSeconds: Number(item.ahtSeconds),
          shrinkagePercent: Number(item.shrinkagePercent),
        })),
        agents: agents.map((agent) => {
          const latestLog = agent.timeLogs?.[0];

          return {
            employeeId: agent.employeeId,
            name: agent.name,
            vendor: agent.vendor,
            supervisor: agent.supervisor,
            hourlyRate: Number(agent.hourlyRate),
            status: agent.status,
            workDate: latestLog?.workDate || "",
            scheduledStart: latestLog?.scheduledStart || "",
            scheduledEnd: latestLog?.scheduledEnd || "",
            actualLogin: latestLog?.actualLogin || "",
            actualLogout: latestLog?.actualLogout || "",
            callsHandled: latestLog?.callsHandled || 0,
            ahtSeconds: latestLog?.ahtSeconds || 0,
            qaScore: Number(latestLog?.qaScore || 0),
            fcrScore: Number(latestLog?.fcrScore || 0),
            costPerCall: Number(latestLog?.costPerCall || 0),
            unproductiveShrinkageHours: Number(latestLog?.unproductiveShrinkageHours || 0),
            costOfGeneralSlack:
              Number(agent.hourlyRate) * Number(latestLog?.unproductiveShrinkageHours || 0),
          };
        }),
      });
    }

    return res.json(buildMockDashboardData());
  } catch (error) {
    console.error("Dashboard route error:", error.message);

    return res.json({
      ...buildMockDashboardData(),
      warning: "Using mock data because live source failed.",
      error: error.message,
    });
  }
});

router.post("/savings/calculate", async (req, res) => {
  try {
    const result = calculateEstimatedSavings(req.body);

    return res.json({
      ok: true,
      ...result,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: error.message,
    });
  }
});

router.post("/savings/audit", async (req, res) => {
  try {
    const savedToSheet = await saveSavingsAuditToGoogleSheet(req.body);

    return res.json({
      ok: true,
      savedToSheet,
      message: savedToSheet
        ? "Savings audit saved to Google Sheet."
        : "Savings audit calculated locally. Google Sheet save is not configured.",
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
});

export default router;