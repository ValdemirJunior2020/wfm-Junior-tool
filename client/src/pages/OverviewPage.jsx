// client/src/pages/OverviewPage.jsx

import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  LineChart,
  Line,
} from "recharts";
import {
  AlertTriangle,
  DollarSign,
  ExternalLink,
  TrendingDown,
  Users,
} from "lucide-react";
import { useDashboardData } from "../hooks/useDashboardData.js";
import DataSourceBadge from "../components/DataSourceBadge.jsx";

const GOOGLE_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1AO5cK9QpQP4hW5s-C53b1IcPkZoRGA_nDyigN_rDRr0/edit?gid=275923664#gid=275923664";

const VALID_VENDORS = ["Tep", "Concentrix", "Buwelo", "Telus"];

function formatMoney(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(Number(value || 0));
}

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function normalizeVendorName(value) {
  const text = String(value || "").trim();

  return VALID_VENDORS.find(
    (vendor) => vendor.toLowerCase() === text.toLowerCase()
  );
}

function OverviewPage() {
  const { loading, error, source, generatedAt, vendorSummary, agents } =
    useDashboardData();

  const cleanVendorSummary = useMemo(() => {
    const latestByVendor = new Map();

    vendorSummary.forEach((item) => {
      const vendor = normalizeVendorName(item.vendor);

      if (!vendor) return;

      latestByVendor.set(vendor, {
        vendor,
        currentBilledAgents: toNumber(item.currentBilledAgents),
        optimizedRequiredAgents: toNumber(item.optimizedRequiredAgents),
        avgHourlyRate: toNumber(item.avgHourlyRate),
        unproductiveShrinkageHours: toNumber(item.unproductiveShrinkageHours),
        costPerCall: toNumber(item.costPerCall),
        qaScore: toNumber(item.qaScore),
        ocrScore: toNumber(item.ocrScore || item.fcrScore),
        monthlyWaste: toNumber(item.monthlyWaste),
        monthlySavings: toNumber(item.monthlySavings),
        monthlyCallVolume: toNumber(item.monthlyCallVolume),
        ahtSeconds: toNumber(item.ahtSeconds),
        shrinkagePercent: toNumber(item.shrinkagePercent),
      });
    });

    return VALID_VENDORS.map((vendor) => latestByVendor.get(vendor)).filter(
      Boolean
    );
  }, [vendorSummary]);

  const cleanAgents = useMemo(() => {
    return agents
      .map((agent) => {
        const vendor = normalizeVendorName(agent.vendor);

        if (!vendor) return null;

        const hourlyRate = toNumber(agent.hourlyRate);
        const unproductiveShrinkageHours = toNumber(
          agent.unproductiveShrinkageHours
        );

        const costOfUnproductiveShrinkage =
          toNumber(agent.costOfUnproductiveShrinkage) ||
          toNumber(agent.costOfGeneralSlack) ||
          Number((hourlyRate * unproductiveShrinkageHours).toFixed(2));

        return {
          ...agent,
          vendor,
          hourlyRate,
          unproductiveShrinkageHours,
          costOfUnproductiveShrinkage,
          qaScore: toNumber(agent.qaScore),
          ocrScore: toNumber(agent.ocrScore || agent.fcrScore),
          costPerCall: toNumber(agent.costPerCall),
        };
      })
      .filter(Boolean);
  }, [agents]);

  if (loading) {
    return (
      <div className="page-stack">
        <section className="page-header">
          <span className="eyebrow">Loading</span>
          <h1>Loading Google Sheet Data...</h1>
          <p>Reading live dashboard data from your WFM Google Sheet.</p>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-stack">
        <section className="page-header">
          <span className="eyebrow">Google Sheet Error</span>
          <h1>Could Not Load Google Sheet Data</h1>
          <p>{error}</p>
        </section>
      </div>
    );
  }

  const totalCurrentAgents = cleanVendorSummary.reduce(
    (sum, item) => sum + item.currentBilledAgents,
    0
  );

  const totalOptimizedAgents = cleanVendorSummary.reduce(
    (sum, item) => sum + item.optimizedRequiredAgents,
    0
  );

  const totalAgentGap = totalCurrentAgents - totalOptimizedAgents;

  const totalMonthlySavings = cleanVendorSummary.reduce(
    (sum, item) => sum + item.monthlySavings,
    0
  );

  const totalAnnualSavings = totalMonthlySavings * 12;

  const totalMonthlyWaste = cleanVendorSummary.reduce(
    (sum, item) => sum + item.monthlyWaste,
    0
  );

  const avgQaScore =
    cleanVendorSummary.length > 0
      ? cleanVendorSummary.reduce((sum, item) => sum + item.qaScore, 0) /
        cleanVendorSummary.length
      : 0;

  const avgOcrScore =
    cleanVendorSummary.length > 0
      ? cleanVendorSummary.reduce((sum, item) => sum + item.ocrScore, 0) /
        cleanVendorSummary.length
      : 0;

  const avgCostPerCall =
    cleanVendorSummary.length > 0
      ? cleanVendorSummary.reduce((sum, item) => sum + item.costPerCall, 0) /
        cleanVendorSummary.length
      : 0;

  const staffingChartData = cleanVendorSummary.map((item) => ({
    vendor: item.vendor,
    current: item.currentBilledAgents,
    optimized: item.optimizedRequiredAgents,
  }));

  const wasteChartData = cleanVendorSummary.map((item) => ({
    vendor: item.vendor,
    monthlyWaste: item.monthlyWaste,
    monthlySavings: item.monthlySavings,
  }));

  const topWasteAgents = [...cleanAgents]
    .sort(
      (a, b) =>
        Number(b.costOfUnproductiveShrinkage || 0) -
        Number(a.costOfUnproductiveShrinkage || 0)
    )
    .slice(0, 8);

  return (
    <div className="page-stack">
      <section className="page-header">
        <div className="page-header-actions">
          <div>
            <span className="eyebrow">Executive Overview</span>
            <h1>Call Center Cost Intelligence Dashboard</h1>
            <p>
              A leadership-ready view of staffing efficiency, financial waste,
              vendor performance, quality return on investment, and estimated
              savings across Tep, Concentrix, Buwelo, and Telus.
            </p>
          </div>

          <a
            href={GOOGLE_SHEET_URL}
            target="_blank"
            rel="noreferrer"
            className="sheet-open-button"
          >
            <ExternalLink size={18} />
            Open Original Google Sheet
          </a>
        </div>

        <div style={{ marginTop: "18px" }}>
          <DataSourceBadge source={source} generatedAt={generatedAt} />
        </div>
      </section>

      <section className="insight-banner">
        <div>
          <span>Demo Data Notice</span>
          <strong>Google Sheet Source</strong>
        </div>

        <p>
          This dashboard is now reading from the WFM Google Sheet through the
          Apps Script Web App. The chart uses the latest valid row per vendor to
          keep the executive view clean.
        </p>
      </section>

      <section className="kpi-grid">
        <div className="kpi-card danger">
          <p>Monthly Waste</p>
          <h2>{formatMoney(totalMonthlyWaste)}</h2>
          <span>Estimated cost of unproductive shrinkage.</span>
        </div>

        <div className="kpi-card success">
          <p>Monthly Savings Opportunity</p>
          <h2>{formatMoney(totalMonthlySavings)}</h2>
          <span>If staffing matched optimized requirement.</span>
        </div>

        <div className="kpi-card success">
          <p>Annualized Savings</p>
          <h2>{formatMoney(totalAnnualSavings)}</h2>
          <span>Projected yearly savings opportunity.</span>
        </div>

        <div className="kpi-card warning">
          <p>Agent Overstaffing Gap</p>
          <h2>{formatNumber(totalAgentGap)}</h2>
          <span>Current billed agents above optimized model.</span>
        </div>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">Staffing Efficiency</span>
            <h2>Current Billed Agents vs Optimized Requirement</h2>
          </div>

          <div className="callout-pill">
            Savings: {formatMoney(totalMonthlySavings)} / month
          </div>
        </div>

        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={380}>
            <BarChart
              data={staffingChartData}
              margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="vendor" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="current"
                name="Current Billed Agents"
                fill="#2563eb"
                radius={[10, 10, 0, 0]}
              />
              <Bar
                dataKey="optimized"
                name="Optimized Required Agents"
                fill="#16a34a"
                radius={[10, 10, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">Waste vs Savings</span>
            <h2>Monthly Waste and Savings Opportunity by Vendor</h2>
          </div>
        </div>

        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={360}>
            <LineChart
              data={wasteChartData}
              margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="vendor" />
              <YAxis tickFormatter={(value) => `$${Number(value) / 1000}k`} />
              <Tooltip
                formatter={(value) => [formatMoney(value), "Amount"]}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="monthlyWaste"
                name="Monthly Waste"
                stroke="#dc2626"
                strokeWidth={4}
                dot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="monthlySavings"
                name="Monthly Savings"
                stroke="#16a34a"
                strokeWidth={4}
                dot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="kpi-grid">
        <div className="kpi-card">
          <p>
            <DollarSign size={18} /> Average Cost Per Call
          </p>
          <h2>${avgCostPerCall.toFixed(2)}</h2>
          <span>Average across all vendors.</span>
        </div>

        <div className="kpi-card">
          <p>
            <Users size={18} /> Total Agents
          </p>
          <h2>{formatNumber(cleanAgents.length)}</h2>
          <span>Agent records loaded from Google Sheet.</span>
        </div>

        <div className="kpi-card success">
          <p>Average QA Score</p>
          <h2>{avgQaScore.toFixed(1)}%</h2>
          <span>Quality assurance score average.</span>
        </div>

        <div className="kpi-card warning">
          <p>Average OCR Score</p>
          <h2>{avgOcrScore.toFixed(1)}%</h2>
          <span>OCR score average.</span>
        </div>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">Agent-Level Risk</span>
            <h2>Top Unproductive Shrinkage Cost Agents</h2>
          </div>

          <div className="callout-pill">
            <AlertTriangle size={16} /> Coaching Priority
          </div>
        </div>

        <div className="responsive-table">
          <table>
            <thead>
              <tr>
                <th>Agent</th>
                <th>Vendor</th>
                <th>Supervisor</th>
                <th>Hourly Rate</th>
                <th>Unproductive Hours</th>
                <th>Unproductive Cost</th>
                <th>QA</th>
                <th>OCR</th>
              </tr>
            </thead>

            <tbody>
              {topWasteAgents.map((agent) => (
                <tr key={agent.employeeId}>
                  <td>
                    <strong>{agent.name}</strong>
                    <br />
                    <span>{agent.employeeId}</span>
                  </td>
                  <td>{agent.vendor}</td>
                  <td>{agent.supervisor}</td>
                  <td>${Number(agent.hourlyRate).toFixed(2)}</td>
                  <td>{Number(agent.unproductiveShrinkageHours).toFixed(2)}</td>
                  <td className="danger-text">
                    {formatMoney(agent.costOfUnproductiveShrinkage)}
                  </td>
                  <td>{Number(agent.qaScore).toFixed(1)}%</td>
                  <td>{Number(agent.ocrScore).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="insight-banner">
        <div>
          <span>Executive Message</span>
          <strong>
            <TrendingDown size={30} /> Reduce Waste
          </strong>
        </div>

        <p>
          This dashboard is designed to show where operational shrinkage,
          overstaffing, and vendor-level performance gaps are creating avoidable
          cost. Keep the Google Sheet updated with schedules, logins, breaks,
          lunch, downtime, meetings, calls handled, AHT, QA, OCR, and cost per
          call.
        </p>
      </section>
    </div>
  );
}

export default OverviewPage;