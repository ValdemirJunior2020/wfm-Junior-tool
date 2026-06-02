// client/src/data/mockDashboard.js

export const vendors = ["Tep", "Concentrix", "Buwelo", "Telus"];

export const vendorColors = {
  Tep: "#2563eb",
  Concentrix: "#16a34a",
  Buwelo: "#f97316",
  Telus: "#9333ea",
};

export const vendorSummary = [
  {
    vendor: "Tep",
    currentBilledAgents: 108,
    optimizedRequiredAgents: 91,
    avgHourlyRate: 17.75,
    unproductiveShrinkageHours: 620,
    costPerCall: 3.72,
    qaScore: 88.4,
    fcrScore: 82.7,
    monthlyWaste: 11005,
    monthlySavings: 52156,
    monthlyCallVolume: 42600,
    ahtSeconds: 455,
    shrinkagePercent: 31,
  },
  {
    vendor: "Concentrix",
    currentBilledAgents: 102,
    optimizedRequiredAgents: 88,
    avgHourlyRate: 18.25,
    unproductiveShrinkageHours: 540,
    costPerCall: 3.55,
    qaScore: 91.1,
    fcrScore: 84.2,
    monthlyWaste: 9855,
    monthlySavings: 44688,
    monthlyCallVolume: 44100,
    ahtSeconds: 455,
    shrinkagePercent: 31,
  },
  {
    vendor: "Buwelo",
    currentBilledAgents: 95,
    optimizedRequiredAgents: 82,
    avgHourlyRate: 16.95,
    unproductiveShrinkageHours: 490,
    costPerCall: 3.28,
    qaScore: 89.7,
    fcrScore: 85.9,
    monthlyWaste: 8306,
    monthlySavings: 35256,
    monthlyCallVolume: 39750,
    ahtSeconds: 455,
    shrinkagePercent: 31,
  },
  {
    vendor: "Telus",
    currentBilledAgents: 95,
    optimizedRequiredAgents: 79,
    avgHourlyRate: 19.1,
    unproductiveShrinkageHours: 575,
    costPerCall: 3.94,
    qaScore: 92.4,
    fcrScore: 86.5,
    monthlyWaste: 10983,
    monthlySavings: 48900,
    monthlyCallVolume: 38650,
    ahtSeconds: 455,
    shrinkagePercent: 31,
  },
];

function buildAgents() {
  const rows = [];

  for (let i = 0; i < 400; i += 1) {
    const vendor = vendors[i % vendors.length];
    const vendorMetric = vendorSummary.find((item) => item.vendor === vendor);

    const hourlyRate = Number(
      (vendorMetric.avgHourlyRate + ((i % 7) - 3) * 0.15).toFixed(2)
    );

    const unproductiveShrinkageHours = Number(
      (0.4 + (i % 9) * 0.12).toFixed(2)
    );

    const qaScore = Number((84 + (i % 12) + (vendor === "Telus" ? 1.5 : 0)).toFixed(1));
    const fcrScore = Number((78 + (i % 14) + (vendor === "Buwelo" ? 1.2 : 0)).toFixed(1));
    const costPerCall = Number((3.15 + (i % 10) * 0.08 + (vendor === "Telus" ? 0.28 : 0)).toFixed(2));

    rows.push({
      id: i + 1,
      employeeId: `${vendor.toUpperCase().slice(0, 3)}-${String(i + 1).padStart(4, "0")}`,
      name: `Agent ${String(i + 1).padStart(3, "0")}`,
      vendor,
      supervisor: `Supervisor ${1 + (i % 8)}`,
      hourlyRate,
      status: "Active",
      workDate: "2026-06-01",
      scheduledStart: "08:00",
      scheduledEnd: "16:30",
      actualLogin: "08:03",
      actualLogout: "16:37",
      break1Start: "10:00",
      break1End: "10:17",
      lunchStart: "12:00",
      lunchEnd: "12:30",
      break2Start: "14:30",
      break2End: "14:47",
      meetingMinutes: (i % 5) * 8,
      trainingMinutes: (i % 3) * 6,
      systemDowntimeMinutes: (i % 6) * 7,
      afterCallWorkMinutes: 24 + (i % 12),
      callsHandled: 38 + (i % 25),
      ahtSeconds: 420 + (i % 15) * 12,
      qaScore,
      fcrScore,
      costPerCall,
      unproductiveShrinkageHours,
      costOfGeneralSlack: Number((hourlyRate * unproductiveShrinkageHours).toFixed(2)),
    });
  }

  return rows;
}

export const agents = buildAgents();

export const qualityCostScatter = agents.map((agent) => ({
  vendor: agent.vendor,
  agentName: agent.name,
  employeeId: agent.employeeId,
  costPerCall: agent.costPerCall,
  qaScore: agent.qaScore,
  fcrScore: agent.fcrScore,
  qualityScore: Number(((agent.qaScore + agent.fcrScore) / 2).toFixed(1)),
  callsHandled: agent.callsHandled,
  fill: vendorColors[agent.vendor],
}));

export function getDashboardMockData() {
  return {
    ok: true,
    source: "client-mock-data",
    generatedAt: new Date().toISOString(),
    vendorSummary,
    agents,
    qualityCostScatter,
  };
}