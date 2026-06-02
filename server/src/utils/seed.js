// server/src/utils/seed.js
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { calculateSavingsFromAgents } from "../services/erlangC.js";

const prisma = new PrismaClient();

const vendorConfigs = [
  { name: "Tep", hourlyRate: 17.75, current: 108, optimized: 91, qa: 88.4, fcr: 82.7, costPerCall: 3.72, calls: 42600 },
  { name: "Concentrix", hourlyRate: 18.25, current: 102, optimized: 88, qa: 91.1, fcr: 84.2, costPerCall: 3.55, calls: 44100 },
  { name: "Buwelo", hourlyRate: 16.95, current: 95, optimized: 82, qa: 89.7, fcr: 85.9, costPerCall: 3.28, calls: 39750 },
  { name: "Telus", hourlyRate: 19.1, current: 95, optimized: 79, qa: 92.4, fcr: 86.5, costPerCall: 3.94, calls: 38650 }
];

function dateAt(dayOffset, hour, minute = 0) {
  const date = new Date();
  date.setDate(date.getDate() - dayOffset);
  date.setHours(hour, minute, 0, 0);
  return date;
}

async function main() {
  console.log("Seeding vendors, 400 agents, daily logs, quality metrics, and monthly metrics...");

  await prisma.savingsAuditLog.deleteMany();
  await prisma.vendorMonthlyMetric.deleteMany();
  await prisma.qualityMetric.deleteMany();
  await prisma.dailyTimeLog.deleteMany();
  await prisma.agent.deleteMany();
  await prisma.vendor.deleteMany();

  const vendors = {};

  for (const config of vendorConfigs) {
    vendors[config.name] = await prisma.vendor.create({
      data: {
        name: config.name,
        country: "US / Offshore blended"
      }
    });

    const savings = calculateSavingsFromAgents({
      currentBilledAgents: config.current,
      optimizedRequiredAgents: config.optimized,
      avgHourlyRate: config.hourlyRate,
      monthlyBillableHoursPerAgent: 160
    });

    const monthlyWaste = config.hourlyRate * (config.name === "Tep" ? 620 : config.name === "Concentrix" ? 540 : config.name === "Buwelo" ? 490 : 575);

    await prisma.vendorMonthlyMetric.create({
      data: {
        vendorId: vendors[config.name].id,
        month: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        currentBilledAgents: config.current,
        optimizedRequiredAgents: config.optimized,
        monthlyBillableHours: config.current * 160,
        avgHourlyRate: config.hourlyRate,
        monthlyCallVolume: config.calls,
        avgHandleTimeSeconds: 455,
        serviceLevelSeconds: 20,
        targetServiceLevel: 0.8,
        occupancyTarget: 0.85,
        shrinkagePercent: 0.31,
        qaScore: config.qa,
        firstCallResolution: config.fcr,
        costPerCall: config.costPerCall,
        monthlyWaste,
        monthlySavings: savings.estimatedMonthlySavings
      }
    });
  }

  for (let i = 0; i < 400; i += 1) {
    const config = vendorConfigs[i % vendorConfigs.length];
    const vendor = vendors[config.name];
    const employeeId = `${config.name.toUpperCase().slice(0, 3)}-${String(i + 1).padStart(4, "0")}`;
    const shiftStartHour = 7 + (i % 4);
    const breakMinutes = 30 + (i % 4) * 5;
    const lunchMinutes = 30;
    const meetingMinutes = (i % 5) * 8;
    const downtimeMinutes = (i % 6) * 7;
    const productiveMinutes = 480 - breakMinutes - lunchMinutes - meetingMinutes - downtimeMinutes;

    const agent = await prisma.agent.create({
      data: {
        employeeId,
        fullName: `Agent ${String(i + 1).padStart(3, "0")}`,
        vendorId: vendor.id,
        hourlyRate: Number((config.hourlyRate + ((i % 7) - 3) * 0.15).toFixed(2)),
        status: "Active",
        hireDate: dateAt(365 - (i % 280), 9),
        supervisor: `Supervisor ${1 + (i % 8)}`
      }
    });

    await prisma.dailyTimeLog.create({
      data: {
        workDate: dateAt(i % 14, 0),
        vendorId: vendor.id,
        agentId: agent.id,
        scheduledStart: dateAt(i % 14, shiftStartHour),
        scheduledEnd: dateAt(i % 14, shiftStartHour + 8, 30),
        actualLogin: dateAt(i % 14, shiftStartHour, i % 9),
        actualLogout: dateAt(i % 14, shiftStartHour + 8, 24 + (i % 8)),
        firstBreakStart: dateAt(i % 14, shiftStartHour + 2, 0),
        firstBreakEnd: dateAt(i % 14, shiftStartHour + 2, 15 + (i % 5)),
        lunchStart: dateAt(i % 14, shiftStartHour + 4, 0),
        lunchEnd: dateAt(i % 14, shiftStartHour + 4, lunchMinutes),
        secondBreakStart: dateAt(i % 14, shiftStartHour + 6, 0),
        secondBreakEnd: dateAt(i % 14, shiftStartHour + 6, 15 + (i % 4)),
        meetingMinutes,
        trainingMinutes: (i % 3) * 6,
        systemDowntimeMinutes: downtimeMinutes,
        afterCallWorkMinutes: 24 + (i % 12),
        productiveMinutes,
        unproductiveShrinkageMin: breakMinutes + lunchMinutes + meetingMinutes + downtimeMinutes,
        callsHandled: 38 + (i % 25),
        avgHandleTimeSeconds: 420 + (i % 15) * 12,
        occupancyPercent: Number((78 + (i % 11)).toFixed(2)),
        adherencePercent: Number((86 + (i % 10)).toFixed(2)),
        notes: i % 19 === 0 ? "Review schedule adherence and unproductive shrinkage." : null
      }
    });

    await prisma.qualityMetric.create({
      data: {
        agentId: agent.id,
        metricDate: dateAt(i % 14, 0),
        qaScore: Number((config.qa + ((i % 9) - 4) * 0.55).toFixed(2)),
        firstCallResolution: Number((config.fcr + ((i % 8) - 3) * 0.7).toFixed(2)),
        repeatCallRate: Number((7 + (i % 8) * 0.35).toFixed(2)),
        costPerCall: Number((config.costPerCall + ((i % 7) - 3) * 0.04).toFixed(2)),
        callsAudited: 3 + (i % 6)
      }
    });
  }

  console.log("Seed completed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
