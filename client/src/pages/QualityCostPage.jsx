// client/src/pages/QualityCostPage.jsx

import React, { useMemo, useState } from "react";
import {
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Award, DollarSign, Filter, Target } from "lucide-react";
import {
  qualityCostScatter,
  vendorColors,
  vendors,
} from "../data/mockDashboard.js";

function formatMoney(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

function QualityCostPage() {
  const [selectedVendor, setSelectedVendor] = useState("All Vendors");

  const filteredData = useMemo(() => {
    if (selectedVendor === "All Vendors") {
      return qualityCostScatter;
    }

    return qualityCostScatter.filter((item) => item.vendor === selectedVendor);
  }, [selectedVendor]);

  const vendorGroups = useMemo(() => {
    return vendors.map((vendor) => ({
      vendor,
      color: vendorColors[vendor],
      data: filteredData.filter((item) => item.vendor === vendor),
    }));
  }, [filteredData]);

  const bestRoiAgent = useMemo(() => {
    if (!filteredData.length) return null;

    return [...filteredData].sort((a, b) => {
      const scoreA = Number(a.qualityScore || 0) / Number(a.costPerCall || 1);
      const scoreB = Number(b.qualityScore || 0) / Number(b.costPerCall || 1);
      return scoreB - scoreA;
    })[0];
  }, [filteredData]);

  const avgCostPerCall = useMemo(() => {
    if (!filteredData.length) return 0;

    return (
      filteredData.reduce((sum, item) => sum + Number(item.costPerCall || 0), 0) /
      filteredData.length
    );
  }, [filteredData]);

  const avgQualityScore = useMemo(() => {
    if (!filteredData.length) return 0;

    return (
      filteredData.reduce(
        (sum, item) => sum + Number(item.qualityScore || 0),
        0
      ) / filteredData.length
    );
  }, [filteredData]);

  const avgQaScore = useMemo(() => {
    if (!filteredData.length) return 0;

    return (
      filteredData.reduce((sum, item) => sum + Number(item.qaScore || 0), 0) /
      filteredData.length
    );
  }, [filteredData]);

  const lowCostHighQualityAgents = useMemo(() => {
    return filteredData
      .filter(
        (item) =>
          Number(item.costPerCall || 0) <= avgCostPerCall &&
          Number(item.qualityScore || 0) >= avgQualityScore
      )
      .slice(0, 10);
  }, [filteredData, avgCostPerCall, avgQualityScore]);

  return (
    <div className="page-stack">
      <section className="page-header">
        <span className="eyebrow">Quality vs Cost ROI</span>
        <h1>Cost Per Call vs QA / First Call Resolution</h1>
        <p>
          This page helps leadership identify which vendors and agents are
          producing the strongest quality return for the cost. The best result
          is low cost per call with high QA and FCR performance.
        </p>
      </section>

      <section className="kpi-grid">
        <div className="kpi-card">
          <p>
            <DollarSign size={18} /> Average Cost Per Call
          </p>
          <h2>{formatMoney(avgCostPerCall)}</h2>
          <span>Lower is better when quality remains strong.</span>
        </div>

        <div className="kpi-card success">
          <p>
            <Award size={18} /> Average Quality Score
          </p>
          <h2>{avgQualityScore.toFixed(1)}%</h2>
          <span>Average of QA and FCR performance.</span>
        </div>

        <div className="kpi-card success">
          <p>
            <Target size={18} /> Average QA Score
          </p>
          <h2>{avgQaScore.toFixed(1)}%</h2>
          <span>Quality assurance score average.</span>
        </div>

        <div className="kpi-card warning">
          <p>
            <Filter size={18} /> Selected View
          </p>
          <h2>{selectedVendor}</h2>
          <span>Current vendor filter.</span>
        </div>
      </section>

      {bestRoiAgent && (
        <section className="insight-banner">
          <div>
            <span>Best Quality ROI Agent</span>
            <strong>{bestRoiAgent.agentName}</strong>
          </div>

          <p>
            {bestRoiAgent.agentName} from <b>{bestRoiAgent.vendor}</b> has a
            cost per call of <b>{formatMoney(bestRoiAgent.costPerCall)}</b> and
            a quality score of <b>{bestRoiAgent.qualityScore.toFixed(1)}%</b>.
            This is the type of profile leadership should use as a benchmark.
          </p>
        </section>
      )}

      <section className="panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">Vendor Filter</span>
            <h2>Filter Quality ROI by Vendor</h2>
          </div>

          <select
            value={selectedVendor}
            onChange={(event) => setSelectedVendor(event.target.value)}
          >
            <option value="All Vendors">All Vendors</option>
            {vendors.map((vendor) => (
              <option key={vendor} value={vendor}>
                {vendor}
              </option>
            ))}
          </select>
        </div>

        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={460}>
            <ScatterChart margin={{ top: 20, right: 30, bottom: 30, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey="costPerCall"
                name="Cost Per Call"
                domain={["dataMin - 0.2", "dataMax + 0.2"]}
                tickFormatter={(value) => `$${Number(value).toFixed(2)}`}
                label={{
                  value: "Cost Per Call",
                  position: "insideBottom",
                  offset: -10,
                }}
              />
              <YAxis
                type="number"
                dataKey="qualityScore"
                name="Quality Score"
                domain={[70, 100]}
                tickFormatter={(value) => `${Number(value).toFixed(0)}%`}
                label={{
                  value: "QA / FCR Quality Score",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <ZAxis
                type="number"
                dataKey="callsHandled"
                range={[60, 260]}
                name="Calls Handled"
              />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                formatter={(value, name) => {
                  if (name === "Cost Per Call") {
                    return [formatMoney(value), name];
                  }

                  if (name === "Quality Score") {
                    return [`${Number(value).toFixed(1)}%`, name];
                  }

                  return [value, name];
                }}
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;

                  const item = payload[0].payload;

                  return (
                    <div
                      style={{
                        background: "white",
                        border: "1px solid #e2e8f0",
                        borderRadius: "16px",
                        padding: "14px",
                        boxShadow: "0 18px 40px rgba(15, 23, 42, 0.12)",
                      }}
                    >
                      <strong>{item.agentName}</strong>
                      <p style={{ margin: "6px 0" }}>{item.vendor}</p>
                      <p style={{ margin: "4px 0" }}>
                        Cost Per Call: <b>{formatMoney(item.costPerCall)}</b>
                      </p>
                      <p style={{ margin: "4px 0" }}>
                        QA Score: <b>{Number(item.qaScore).toFixed(1)}%</b>
                      </p>
                      <p style={{ margin: "4px 0" }}>
                        FCR Score: <b>{Number(item.fcrScore).toFixed(1)}%</b>
                      </p>
                      <p style={{ margin: "4px 0" }}>
                        Quality Score:{" "}
                        <b>{Number(item.qualityScore).toFixed(1)}%</b>
                      </p>
                      <p style={{ margin: "4px 0" }}>
                        Calls Handled: <b>{item.callsHandled}</b>
                      </p>
                    </div>
                  );
                }}
              />
              <Legend />

              {vendorGroups.map((group) => (
                <Scatter
                  key={group.vendor}
                  name={group.vendor}
                  data={group.data}
                  fill={group.color}
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">Best ROI Zone</span>
            <h2>Low Cost / High Quality Agents</h2>
          </div>

          <div className="callout-pill">
            {lowCostHighQualityAgents.length} agents found
          </div>
        </div>

        <div className="responsive-table">
          <table>
            <thead>
              <tr>
                <th>Agent</th>
                <th>Vendor</th>
                <th>Cost Per Call</th>
                <th>QA Score</th>
                <th>FCR Score</th>
                <th>Quality Score</th>
                <th>Calls Handled</th>
              </tr>
            </thead>

            <tbody>
              {lowCostHighQualityAgents.map((agent) => (
                <tr key={agent.employeeId}>
                  <td>
                    <strong>{agent.agentName}</strong>
                    <br />
                    <span>{agent.employeeId}</span>
                  </td>
                  <td>{agent.vendor}</td>
                  <td>{formatMoney(agent.costPerCall)}</td>
                  <td>{Number(agent.qaScore).toFixed(1)}%</td>
                  <td>{Number(agent.fcrScore).toFixed(1)}%</td>
                  <td className="danger-text">
                    {Number(agent.qualityScore).toFixed(1)}%
                  </td>
                  <td>{agent.callsHandled}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">How to Read This</span>
            <h2>Executive Interpretation</h2>
          </div>
        </div>

        <div className="formula-card">
          <span>Best vendor/agent profile</span>
          <strong>Low Cost Per Call + High QA/FCR Score</strong>
        </div>

        <p className="muted">
          Vendors or agents on the upper-left side of the scatter plot are the
          strongest performers because they deliver higher quality at a lower
          cost. Vendors or agents on the lower-right side need review because
          they cost more while producing weaker quality outcomes.
        </p>
      </section>
    </div>
  );
}

export default QualityCostPage;