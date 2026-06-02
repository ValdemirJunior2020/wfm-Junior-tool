// client/src/pages/ErlangSavingsPage.jsx

import React, { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Calculator, DollarSign, TrendingDown, Users } from "lucide-react";
import { vendorSummary } from "../data/mockDashboard.js";

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

function ErlangSavingsPage() {
  const [selectedVendor, setSelectedVendor] = useState("All Vendors");

  const filteredData = useMemo(() => {
    if (selectedVendor === "All Vendors") {
      return vendorSummary;
    }

    return vendorSummary.filter((item) => item.vendor === selectedVendor);
  }, [selectedVendor]);

  const totals = useMemo(() => {
    const currentBilledAgents = filteredData.reduce(
      (sum, item) => sum + Number(item.currentBilledAgents || 0),
      0
    );

    const optimizedRequiredAgents = filteredData.reduce(
      (sum, item) => sum + Number(item.optimizedRequiredAgents || 0),
      0
    );

    const monthlySavings = filteredData.reduce(
      (sum, item) => sum + Number(item.monthlySavings || 0),
      0
    );

    const monthlyWaste = filteredData.reduce(
      (sum, item) => sum + Number(item.monthlyWaste || 0),
      0
    );

    return {
      currentBilledAgents,
      optimizedRequiredAgents,
      agentGap: currentBilledAgents - optimizedRequiredAgents,
      monthlySavings,
      annualSavings: monthlySavings * 12,
      monthlyWaste,
    };
  }, [filteredData]);

  const chartData = filteredData.map((item) => ({
    vendor: item.vendor,
    currentBilledAgents: Number(item.currentBilledAgents || 0),
    optimizedRequiredAgents: Number(item.optimizedRequiredAgents || 0),
    agentGap:
      Number(item.currentBilledAgents || 0) -
      Number(item.optimizedRequiredAgents || 0),
    monthlySavings: Number(item.monthlySavings || 0),
  }));

  return (
    <div className="page-stack">
      <section className="page-header">
        <span className="eyebrow">Erlang C Savings Calculator</span>
        <h1>Current Billed Agents vs Optimized Required Agents</h1>
        <p>
          This page compares what each BPO vendor is currently billing against
          the mathematically optimized staffing requirement. The difference
          becomes the estimated monthly savings opportunity.
        </p>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">What Erlang C Means</span>
            <h2>Short Explanation</h2>
          </div>

          <Calculator size={34} />
        </div>

        <p className="muted">
          <strong>Erlang C</strong> is a workforce management formula used in
          call centers to estimate how many agents are needed to answer calls
          within a target service level. In simple terms, it helps answer:
          <strong> “How many agents do we really need based on call volume,
          average handle time, and service level goal?”</strong>
        </p>

        <div className="formula-card">
          <span>Business meaning</span>
          <strong>
            If vendors bill more agents than the Erlang C requirement, the
            difference can represent avoidable staffing cost.
          </strong>
        </div>
      </section>

      <section className="kpi-grid">
        <div className="kpi-card">
          <p>
            <Users size={18} /> Current Billed Agents
          </p>
          <h2>{formatNumber(totals.currentBilledAgents)}</h2>
          <span>Agents currently billed by vendor estimates.</span>
        </div>

        <div className="kpi-card success">
          <p>
            <Calculator size={18} /> Optimized Required Agents
          </p>
          <h2>{formatNumber(totals.optimizedRequiredAgents)}</h2>
          <span>Estimated staffing need using Erlang C logic.</span>
        </div>

        <div className="kpi-card warning">
          <p>
            <TrendingDown size={18} /> Agent Gap
          </p>
          <h2>{formatNumber(totals.agentGap)}</h2>
          <span>Potential overstaffing difference.</span>
        </div>

        <div className="kpi-card success">
          <p>
            <DollarSign size={18} /> Monthly Savings
          </p>
          <h2>{formatMoney(totals.monthlySavings)}</h2>
          <span>Estimated monthly savings opportunity.</span>
        </div>
      </section>

      <section className="insight-banner">
        <div>
          <span>Estimated Monthly Savings</span>
          <strong>{formatMoney(totals.monthlySavings)}</strong>
        </div>

        <p>
          The selected view shows an estimated annualized opportunity of{" "}
          <b>{formatMoney(totals.annualSavings)}</b> if staffing is aligned to
          optimized required agents instead of current billed agents.
        </p>
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

        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={420}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="vendor" />
              <YAxis />
              <Tooltip
                formatter={(value, name) => {
                  if (name === "monthlySavings") {
                    return [formatMoney(value), "Monthly Savings"];
                  }

                  return [formatNumber(value), name];
                }}
              />
              <Legend />
              <Bar
                dataKey="currentBilledAgents"
                name="Current Billed Agents"
                fill="#2563eb"
                radius={[10, 10, 0, 0]}
              />
              <Bar
                dataKey="optimizedRequiredAgents"
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
            <span className="eyebrow">Savings Detail</span>
            <h2>Vendor Savings Breakdown</h2>
          </div>

          <div className="callout-pill">
            Total: {formatMoney(totals.monthlySavings)} / month
          </div>
        </div>

        <div className="responsive-table">
          <table>
            <thead>
              <tr>
                <th>Vendor</th>
                <th>Current Billed Agents</th>
                <th>Optimized Required Agents</th>
                <th>Agent Gap</th>
                <th>Monthly Waste</th>
                <th>Monthly Savings</th>
                <th>Annual Savings</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.map((item) => {
                const gap =
                  Number(item.currentBilledAgents || 0) -
                  Number(item.optimizedRequiredAgents || 0);

                return (
                  <tr key={item.vendor}>
                    <td>
                      <strong>{item.vendor}</strong>
                    </td>
                    <td>{formatNumber(item.currentBilledAgents)}</td>
                    <td>{formatNumber(item.optimizedRequiredAgents)}</td>
                    <td className="danger-text">{formatNumber(gap)}</td>
                    <td>{formatMoney(item.monthlyWaste)}</td>
                    <td className="danger-text">
                      {formatMoney(item.monthlySavings)}
                    </td>
                    <td>{formatMoney(Number(item.monthlySavings || 0) * 12)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default ErlangSavingsPage;