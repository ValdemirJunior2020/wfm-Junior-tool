// server/src/services/erlangC.js
function factorial(n) {
  if (n <= 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i += 1) result *= i;
  return result;
}

function erlangCProbability(trafficIntensity, agents) {
  if (agents <= trafficIntensity) return 1;

  let sum = 0;
  for (let n = 0; n < agents; n += 1) {
    sum += Math.pow(trafficIntensity, n) / factorial(n);
  }

  const top = (Math.pow(trafficIntensity, agents) / factorial(agents)) * (agents / (agents - trafficIntensity));
  return top / (sum + top);
}

function serviceLevel(trafficIntensity, agents, averageHandleTimeSeconds, serviceLevelSeconds) {
  const probabilityWait = erlangCProbability(trafficIntensity, agents);
  const exponent = -1 * (agents - trafficIntensity) * (serviceLevelSeconds / averageHandleTimeSeconds);
  return 1 - probabilityWait * Math.exp(exponent);
}

export function calculateRequiredAgents({
  intervalCalls,
  avgHandleTimeSeconds,
  intervalMinutes = 30,
  serviceLevelSeconds = 20,
  targetServiceLevel = 0.8,
  occupancyTarget = 0.85,
  shrinkagePercent = 0.31
}) {
  const trafficIntensity = (intervalCalls * avgHandleTimeSeconds) / (intervalMinutes * 60);
  let agents = Math.max(1, Math.ceil(trafficIntensity));

  while (agents < 10000) {
    const occupancy = trafficIntensity / agents;
    const level = serviceLevel(trafficIntensity, agents, avgHandleTimeSeconds, serviceLevelSeconds);

    if (level >= targetServiceLevel && occupancy <= occupancyTarget) {
      const withShrinkage = Math.ceil(agents / (1 - shrinkagePercent));
      return {
        baseRequiredAgents: agents,
        optimizedRequiredAgents: withShrinkage,
        trafficIntensity: Number(trafficIntensity.toFixed(3)),
        serviceLevel: Number(level.toFixed(4)),
        occupancy: Number(occupancy.toFixed(4)),
        shrinkagePercent
      };
    }

    agents += 1;
  }

  throw new Error("Unable to calculate required agents with provided parameters.");
}

export function calculateSavingsFromAgents({
  currentBilledAgents,
  optimizedRequiredAgents,
  avgHourlyRate,
  monthlyBillableHoursPerAgent = 160
}) {
  const agentGap = Math.max(Number(currentBilledAgents) - Number(optimizedRequiredAgents), 0);
  const estimatedMonthlySavings = agentGap * Number(avgHourlyRate) * Number(monthlyBillableHoursPerAgent);

  return {
    agentGap,
    estimatedMonthlySavings: Number(estimatedMonthlySavings.toFixed(2)),
    estimatedAnnualSavings: Number((estimatedMonthlySavings * 12).toFixed(2))
  };
}
