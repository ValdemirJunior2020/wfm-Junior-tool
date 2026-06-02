// client/src/pages/SlackCostPage.jsx

import React, { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AlertTriangle, Clock, DollarSign, TrendingDown } from "lucide-react";
import { vendorSummary, vendorColors } from "../data/mockDashboard.js";

function formatMoney(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function formatDecimal(value) {
  return Number(value || 0).toFixed(2);
}

function SlackCostPage() {
  const [selectedVendor, setSelectedVendor] = useState("All Vendors");

  const filteredData = useMemo(() => {
    if (selectedVendor === "All Vendors") {
      return vendorSummary;
    }

    return vendorSummary.filter((item) => item.vendor === selectedVendor);
  }, [selectedVendor]);

  const totals = useMemo(() => {
    const totalShrinkageCost = filteredData.reduce(
      (sum, item) => sum + Number(item.monthlyWaste || 0),
      0
    );

    const totalUnproductiveHours = filteredData.reduce(
      (sum, item) => sum + Number(item.unproductiveShrinkageHours || 0),
      0
    );

    const averageHourlyRate =
      filteredData.length > 0
        ? filteredData.reduce(
            (sum, item) => sum + Number(item.avgHourlyRate || 0),
            0
          ) / filteredData.length
        : 0;

    const totalMonthlySavings = filteredData.reduce(
      (sum, item) => sum + Number(item.monthlySavings || 0),
      0
    );

    return {
      totalShrinkageCost,
      totalUnproductiveHours,
      averageHourlyRate,
      totalMonthlySavings,
      annualizedShrinkageCost: totalShrinkageCost * 12,
    };
  }, [filteredData]);

  const chartData = filteredData.map((item) => ({
    vendor: item.vendor,
    unproductiveShrinkageCost: Number(item.monthlyWaste || 0),
    unproductiveShrinkageHours: Number(item.unproductiveShrinkageHours || 0),
    avgHourlyRate: Number(item.avgHourlyRate || 0),
    monthlySavings: Number(item.monthlySavings || 0),
  }));

  return (
    <div className="page-stack">
      <section className="page-header">
        <span className="eyebrow">Unproductive Shrinkage</span>
        <h1>Cost of Unproductive Hours</h1>
        <p>
          This page estimates how much paid time is being lost through
          unproductive shrinkage. This is not related to Slack messages. It is
          based on operational time such as extra breaks, extended lunch,
          system downtime, meetings, coaching, training, late logins, early
          logouts, and unavailable time.
        </p>
      </section>

      <section className="insight-banner">
        <div>
          <span>Formula</span>
          <strong>Hourly Rate × Unproductive Hours</strong>
        </div>

        <p>
          The cost is calculated by multiplying the average hourly rate by the
          total unproductive shrinkage hours. The current numbers are mock demo
          examples only and should be replaced with real WFM data from the call
          centers.
        </p>
      </section>

      <section className="kpi-grid">
        <div className="kpi-card danger">
          <p>
            <DollarSign size={18} /> Monthly Shrinkage Cost
          </p>
          <h2>{formatMoney(totals.totalShrinkageCost)}</h2>
          <span>Estimated monthly cost of unproductive paid time.</span>
        </div>

        <div className="kpi-card warning">
          <p>
            <Clock size={18} /> Unproductive Hours
          </p>
          <h2>{formatDecimal(totals.totalUnproductiveHours)}</h2>
          <span>Total unproductive shrinkage hours in selected view.</span>
        </div>

        <div className="kpi-card">
          <p>Average Hourly Rate</p>
          <h2>${formatDecimal(totals.averageHourlyRate)}</h2>
          <span>Average vendor hourly rate in selected view.</span>
        </div>

        <div className="kpi-card success">
          <p>
            <TrendingDown size={18} /> Annualized Cost
          </p>
          <h2>{formatMoney(totals.annualizedShrinkageCost)}</h2>
          <span>Projected yearly cost if not controlled.</span>
        </div>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">Vendor Filter</span>
            <h2>Select Vendor</h2>
          </div>

          <select
            value={selectedVendor}
            onChange={(event) => setSelectedVendor(event.target.value)}
          >
            <option value="All Vendors">All Vendors</option>
            {vendorSummary.map((item) => (
              <option key={item.vendor} value={item.vendor}>
                {item.vendor}
              </option>
            ))}
          </select>
        </div>

        <div className="formula-card">
          <span>Calculation used on this page</span>
          <strong>
            Cost of Unproductive Shrinkage = Average Hourly Rate × Unproductive
            Shrinkage Hours
          </strong>
        </div>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">Financial Waste by Vendor</span>
            <h2>Monthly Cost of Unproductive Shrinkage</h2>
          </div>

          <div className="callout-pill">
            Total Cost: {formatMoney(totals.totalShrinkageCost)}
          </div>
        </div>

        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={420}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="vendor" />
              <YAxis tickFormatter={(value) => `$${Number(value) / 1000}k`} />
              <Tooltip
                formatter={(value, name) => {
                  if (name === "unproductiveShrinkageCost") {
                    return [
                      formatMoney(value),
                      "Cost of Unproductive Shrinkage",
                    ];
                  }

                  if (name === "unproductiveShrinkageHours") {
                    return [
                      `${Number(value).toFixed(2)} hours`,
                      "Unproductive Hours",
                    ];
                  }

                  if (name === "avgHourlyRate") {
                    return [`$${Number(value).toFixed(2)}`, "Avg Hourly Rate"];
                  }

                  return [value, name];
                }}
              />
              <Legend />
              <Bar
                dataKey="unproductiveShrinkageCost"
                name="Cost of Unproductive Shrinkage"
                radius={[12, 12, 0, 0]}
              >
                {chartData.map((entry) => (
                  <Cell
                    key={entry.vendor}
                    fill={vendorColors[entry.vendor] || "#2563eb"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">Breakdown</span>
            <h2>Vendor-Level Unproductive Time Details</h2>
          </div>

          <AlertTriangle size={32} />
        </div>

        <div className="responsive-table">
          <table>
            <thead>
              <tr>
                <th>Vendor</th>
                <th>Average Hourly Rate</th>
                <th>Unproductive Shrinkage Hours</th>
                <th>Monthly Shrinkage Cost</th>
                <th>Annualized Shrinkage Cost</th>
                <th>Monthly Savings Opportunity</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.map((item) => (
                <tr key={item.vendor}>
                  <td>
                    <strong>{item.vendor}</strong>
                  </td>
                  <td>${Number(item.avgHourlyRate || 0).toFixed(2)}</td>
                  <td>
                    {Number(item.unproductiveShrinkageHours || 0).toFixed(2)}
                  </td>
                  <td className="danger-text">
                    {formatMoney(item.monthlyWaste)}
                  </td>
                  <td>{formatMoney(Number(item.monthlyWaste || 0) * 12)}</td>
                  <td>{formatMoney(item.monthlySavings)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">What Counts as Unproductive Shrinkage</span>
            <h2>Time Categories Used in the Calculation</h2>
          </div>
        </div>

        <div className="responsive-table">
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Example</th>
                <th>Why It Matters</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>
                  <strong>Break Overage</strong>
                </td>
                <td>Agent scheduled for 15 minutes but takes 22 minutes.</td>
                <td>Extra paid time not available for calls.</td>
              </tr>

              <tr>
                <td>
                  <strong>Lunch Overage</strong>
                </td>
                <td>Agent scheduled for 30 minutes but takes 41 minutes.</td>
                <td>Creates coverage gaps and lost productive time.</td>
              </tr>

              <tr>
                <td>
                  <strong>System Downtime</strong>
                </td>
                <td>Agent cannot work because system or tool is down.</td>
                <td>Paid time is consumed without call handling.</td>
              </tr>

              <tr>
                <td>
                  <strong>Meetings / Training / Coaching</strong>
                </td>
                <td>Agent is paid but not available to the queue.</td>
                <td>Valid time, but still affects staffing capacity.</td>
              </tr>

              <tr>
                <td>
                  <strong>Unavailable / Not Ready Time</strong>
                </td>
                <td>Agent remains out of queue after break, lunch, or call.</td>
                <td>Reduces utilization and increases required staffing.</td>
              </tr>

              <tr>
                <td>
                  <strong>Late Login / Early Logout</strong>
                </td>
                <td>Agent starts late or leaves before scheduled end.</td>
                <td>Reduces planned coverage and impacts service level.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">What Real Data Is Needed</span>
            <h2>Inputs Required From Each Call Center</h2>
          </div>
        </div>

        <div className="formula-card">
          <span>Required source fields</span>
          <strong>
            Agent hourly rate, scheduled shift, actual login, actual logout,
            break start/end, lunch start/end, meeting minutes, training minutes,
            coaching minutes, unavailable time, system downtime minutes, calls
            handled, AHT, QA score, OCR score, and cost per call.
          </strong>
        </div>

        <p className="muted">
          Once the vendors send these fields consistently, this page can show
          where paid time is being lost, how much money that lost time costs,
          and which vendor needs coaching, scheduling review, or operational
          correction.
        </p>
      </section>
    </div>
  );
}

export default SlackCostPage;