// server/src/utils/mockDashboardData.js

const vendors = ["Tep", "Concentrix", "Buwelo", "Telus"];

const vendorSummary = [
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
  const agents = [];

  for (let i = 0; i < 400; i += 1) {
    const vendor = vendors[i % vendors.length];
    const vendorMetric = vendorSummary.find((item) => item.vendor === vendor);
    const hourlyRate = Number((vendorMetric.avgHourlyRate + ((i % 7) - 3) * 0.15).toFixed(2));
    const unproductiveShrinkageHours = Number((0.4 + (i % 9) * 0.12).toFixed(2));

    agents.push({
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
      callsHandled: 38 + (i % 25),
      ahtSeconds: 420 + (i % 15) * 12,
      qaScore: 84 + (i % 12),
      fcrScore: 78 + (i % 14),
      costPerCall: Number((3.15 + (i % 10) * 0.08).toFixed(2)),
      unproductiveShrinkageHours,
      costOfGeneralSlack: Number((hourlyRate * unproductiveShrinkageHours).toFixed(2)),
    });
  }

  return agents;
}

export function buildMockDashboardData() {
  return {
    ok: true,
    source: "mock-data",
    generatedAt: new Date().toISOString(),
    vendorSummary,
    agents: buildAgents(),
  };
}

export function calculateEstimatedSavings(payload) {
  const currentBilledAgents = Number(payload.currentBilledAgents || 0);
  const optimizedRequiredAgents = Number(payload.optimizedRequiredAgents || 0);
  const avgHourlyRate = Number(payload.avgHourlyRate || 0);
  const monthlyBillableHoursPerAgent = Number(payload.monthlyBillableHoursPerAgent || 160);

  const agentGap = Math.max(currentBilledAgents - optimizedRequiredAgents, 0);
  const estimatedMonthlySavings = Number(
    (agentGap * avgHourlyRate * monthlyBillableHoursPerAgent).toFixed(2)
  );
  const estimatedAnnualSavings = Number((estimatedMonthlySavings * 12).toFixed(2));

  return {
    vendor: payload.vendor || "All Vendors",
    currentBilledAgents,
    optimizedRequiredAgents,
    agentGap,
    avgHourlyRate,
    monthlyBillableHoursPerAgent,
    estimatedMonthlySavings,
    estimatedAnnualSavings,
  };
}