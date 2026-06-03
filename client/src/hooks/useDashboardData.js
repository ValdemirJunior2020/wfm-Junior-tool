// client/src/hooks/useDashboardData.js

import { useEffect, useMemo, useState } from "react";
import { getDashboardData } from "../services/api.js";

function normalizeVendorSummary(vendorSummary) {
  return vendorSummary.map((item) => ({
    vendor: item.vendor || item.Vendor || "",
    currentBilledAgents: Number(item.currentBilledAgents || 0),
    optimizedRequiredAgents: Number(item.optimizedRequiredAgents || 0),
    avgHourlyRate: Number(item.avgHourlyRate || 0),
    unproductiveShrinkageHours: Number(item.unproductiveShrinkageHours || 0),
    costPerCall: Number(item.costPerCall || 0),
    qaScore: Number(item.qaScore || 0),
    fcrScore: Number(item.fcrScore || item.ocrScore || 0),
    monthlyWaste: Number(item.monthlyWaste || 0),
    monthlySavings: Number(item.monthlySavings || 0),
    monthlyCallVolume: Number(item.monthlyCallVolume || 0),
    ahtSeconds: Number(item.ahtSeconds || 0),
    shrinkagePercent: Number(item.shrinkagePercent || 0),
  }));
}

function normalizeAgents(agents) {
  return agents.map((agent, index) => {
    const hourlyRate = Number(agent.hourlyRate || 0);
    const unproductiveShrinkageHours = Number(
      agent.unproductiveShrinkageHours || 0
    );

    const costOfUnproductiveShrinkage =
      Number(agent.costOfUnproductiveShrinkage) ||
      Number(agent.costOfGeneralSlack) ||
      Number((hourlyRate * unproductiveShrinkageHours).toFixed(2));

    return {
      id: agent.id || index + 1,
      employeeId: agent.employeeId || "",
      name: agent.name || agent.agentName || "",
      vendor: agent.vendor || "",
      supervisor: agent.supervisor || "",
      hourlyRate,
      status: agent.status || "Active",
      workDate: agent.workDate || "",
      scheduledStart: agent.scheduledStart || "",
      scheduledEnd: agent.scheduledEnd || "",
      actualLogin: agent.actualLogin || "",
      actualLogout: agent.actualLogout || "",
      callsHandled: Number(agent.callsHandled || 0),
      ahtSeconds: Number(agent.ahtSeconds || 0),
      qaScore: Number(agent.qaScore || 0),
      fcrScore: Number(agent.fcrScore || agent.ocrScore || 0),
      costPerCall: Number(agent.costPerCall || 0),
      unproductiveShrinkageHours,
      costOfUnproductiveShrinkage,
    };
  });
}

export function useDashboardData() {
  const [state, setState] = useState({
    loading: true,
    error: "",
    source: "",
    generatedAt: "",
    vendorSummary: [],
    agents: [],
  });

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const data = await getDashboardData();

        if (!mounted) return;

        setState({
          loading: false,
          error: "",
          source: data.source || "google-sheet",
          generatedAt: data.generatedAt || "",
          vendorSummary: normalizeVendorSummary(data.vendorSummary),
          agents: normalizeAgents(data.agents),
        });
      } catch (error) {
        if (!mounted) return;

        setState({
          loading: false,
          error: error.message,
          source: "error",
          generatedAt: "",
          vendorSummary: [],
          agents: [],
        });
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const vendors = useMemo(() => {
    const names = new Set();

    state.vendorSummary.forEach((item) => {
      if (item.vendor) names.add(item.vendor);
    });

    state.agents.forEach((agent) => {
      if (agent.vendor) names.add(agent.vendor);
    });

    return Array.from(names);
  }, [state.vendorSummary, state.agents]);

 const vendorColors = useMemo(
  () => ({
    Tep: "#2563eb",
    Concentrix: "#16a34a",
    Buwelo: "#f97316",
    Telus: "#9333ea",
    WNS: "#dc2626",
  }),
  []
);

  const qualityCostScatter = useMemo(() => {
    return state.agents.map((agent) => ({
      vendor: agent.vendor,
      agentName: agent.name,
      employeeId: agent.employeeId,
      costPerCall: agent.costPerCall,
      qaScore: agent.qaScore,
      fcrScore: agent.fcrScore,
      qualityScore: Number(((agent.qaScore + agent.fcrScore) / 2).toFixed(1)),
      callsHandled: agent.callsHandled,
      fill: vendorColors[agent.vendor] || "#2563eb",
    }));
  }, [state.agents, vendorColors]);

  return {
    ...state,
    vendors,
    vendorColors,
    qualityCostScatter,
  };
}