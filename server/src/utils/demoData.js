// server/src/utils/demoData.js
const vendorSummary = [
  { vendor: "Tep", currentBilledAgents: 108, optimizedRequiredAgents: 91, avgHourlyRate: 17.75, unproductiveShrinkageHours: 620, costPerCall: 3.72, qaScore: 88.4, fcrScore: 82.7, monthlyCallVolume: 42600, monthlyWaste: 11005, monthlySavings: 52156 },
  { vendor: "Concentrix", currentBilledAgents: 102, optimizedRequiredAgents: 88, avgHourlyRate: 18.25, unproductiveShrinkageHours: 540, costPerCall: 3.55, qaScore: 91.1, fcrScore: 84.2, monthlyCallVolume: 44100, monthlyWaste: 9855, monthlySavings: 44688 },
  { vendor: "Buwelo", currentBilledAgents: 95, optimizedRequiredAgents: 82, avgHourlyRate: 16.95, unproductiveShrinkageHours: 490, costPerCall: 3.28, qaScore: 89.7, fcrScore: 85.9, monthlyCallVolume: 39750, monthlyWaste: 8306, monthlySavings: 35256 },
  { vendor: "Telus", currentBilledAgents: 95, optimizedRequiredAgents: 79, avgHourlyRate: 19.1, unproductiveShrinkageHours: 575, costPerCall: 3.94, qaScore: 92.4, fcrScore: 86.5, monthlyCallVolume: 38650, monthlyWaste: 10983, monthlySavings: 48900 }
];

export function buildDemoDashboard() {
  const vendors = ["Tep", "Concentrix", "Buwelo", "Telus"];
  const agents = Array.from({ length: 400 }).map((_, index) => {
    const vendor = vendors[index % vendors.length];
    const base = vendorSummary.find((item) => item.vendor === vendor);
    return {
      id: String(index + 1),
      employeeId: `${vendor.toUpperCase().slice(0, 3)}-${String(index + 1).padStart(4, "0")}`,
      agentName: `Agent ${index + 1}`,
      vendor,
      startTime: "08:00",
      endTime: "16:30",
      breakMinutes: 30 + (index % 4) * 5,
      lunchMinutes: 30,
      meetingMinutes: (index % 5) * 8,
      systemDowntimeMinutes: (index % 6) * 7,
      callsHandled: 42 + (index % 17),
      avgHandleTimeSeconds: 445 + (index % 11) * 18,
      qaScore: Number((base.qaScore + ((index % 5) - 2) * 0.8).toFixed(1)),
      fcrScore: Number((base.fcrScore + ((index % 4) - 1) * 0.9).toFixed(1)),
      costPerCall: Number((base.costPerCall + ((index % 4) - 2) * 0.08).toFixed(2))
    };
  });

  return { vendorSummary, agents };
}
