// client/src/pages/AgentsPage.jsx

import React, { useMemo, useState } from "react";
import { Search, Users, DollarSign, Clock, Award } from "lucide-react";
import { agents, vendors } from "../data/mockDashboard.js";

function formatMoney(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(Number(value || 0));
}

function AgentsPage() {
  const [selectedVendor, setSelectedVendor] = useState("All Vendors");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAgents = useMemo(() => {
    return agents.filter((agent) => {
      const matchesVendor =
        selectedVendor === "All Vendors" || agent.vendor === selectedVendor;

      const search = searchTerm.toLowerCase().trim();

      const matchesSearch =
        !search ||
        agent.name.toLowerCase().includes(search) ||
        agent.employeeId.toLowerCase().includes(search) ||
        agent.vendor.toLowerCase().includes(search) ||
        agent.supervisor.toLowerCase().includes(search);

      return matchesVendor && matchesSearch;
    });
  }, [selectedVendor, searchTerm]);

  const totals = useMemo(() => {
    const totalAgents = filteredAgents.length;

    const totalCalls = filteredAgents.reduce(
      (sum, agent) => sum + Number(agent.callsHandled || 0),
      0
    );

    const totalUnproductiveCost = filteredAgents.reduce(
      (sum, agent) =>
        sum +
        Number(
          agent.costOfUnproductiveShrinkage ||
            agent.costOfGeneralSlack ||
            0
        ),
      0
    );

    const totalUnproductiveHours = filteredAgents.reduce(
      (sum, agent) => sum + Number(agent.unproductiveShrinkageHours || 0),
      0
    );

    const avgQaScore =
      totalAgents > 0
        ? filteredAgents.reduce(
            (sum, agent) => sum + Number(agent.qaScore || 0),
            0
          ) / totalAgents
        : 0;

    const avgOcrScore =
      totalAgents > 0
        ? filteredAgents.reduce(
            (sum, agent) =>
              sum + Number(agent.ocrScore || agent.fcrScore || 0),
            0
          ) / totalAgents
        : 0;

    const avgCostPerCall =
      totalAgents > 0
        ? filteredAgents.reduce(
            (sum, agent) => sum + Number(agent.costPerCall || 0),
            0
          ) / totalAgents
        : 0;

    return {
      totalAgents,
      totalCalls,
      totalUnproductiveCost,
      totalUnproductiveHours,
      avgQaScore,
      avgOcrScore,
      avgCostPerCall,
    };
  }, [filteredAgents]);

  const sortedAgents = useMemo(() => {
    return [...filteredAgents].sort(
      (a, b) =>
        Number(
          b.costOfUnproductiveShrinkage || b.costOfGeneralSlack || 0
        ) -
        Number(
          a.costOfUnproductiveShrinkage || a.costOfGeneralSlack || 0
        )
    );
  }, [filteredAgents]);

  return (
    <div className="page-stack">
      <section className="page-header">
        <span className="eyebrow">Agent Details</span>
        <h1>Agent-Level Workforce Management Data</h1>
        <p>
          This page shows the operational details needed to build a professional
          workforce management tool: schedule adherence, login/logout, break
          impact, lunch, calls handled, AHT, QA, OCR, cost per call, and cost of
          unproductive shrinkage.
        </p>
      </section>

      <section className="kpi-grid">
        <div className="kpi-card">
          <p>
            <Users size={18} /> Agents
          </p>
          <h2>{formatNumber(totals.totalAgents)}</h2>
          <span>Filtered agent count.</span>
        </div>

        <div className="kpi-card danger">
          <p>
            <DollarSign size={18} /> Unproductive Cost
          </p>
          <h2>{formatMoney(totals.totalUnproductiveCost)}</h2>
          <span>Estimated cost from unproductive shrinkage.</span>
        </div>

        <div className="kpi-card warning">
          <p>
            <Clock size={18} /> Unproductive Hours
          </p>
          <h2>{totals.totalUnproductiveHours.toFixed(1)}</h2>
          <span>Break overage, meetings, training, and downtime.</span>
        </div>

        <div className="kpi-card success">
          <p>
            <Award size={18} /> Avg QA Score
          </p>
          <h2>{totals.avgQaScore.toFixed(1)}%</h2>
          <span>Average quality score for selected agents.</span>
        </div>
      </section>

      <section className="insight-banner">
        <div>
          <span>Filtered View</span>
          <strong>{selectedVendor}</strong>
        </div>

        <p>
          This view contains <b>{formatNumber(totals.totalAgents)}</b> agents,
          <b> {formatNumber(totals.totalCalls)}</b> handled calls, an average
          cost per call of <b>{formatMoney(totals.avgCostPerCall)}</b>, and an
          average OCR score of <b>{totals.avgOcrScore.toFixed(1)}%</b>.
        </p>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">Filters</span>
            <h2>Search and Filter Agents</h2>
          </div>
        </div>

        <div className="filters-row">
          <label>
            Vendor
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
          </label>

          <label>
            Search Agent / ID / Supervisor
            <div style={{ position: "relative" }}>
              <Search
                size={18}
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "13px",
                  color: "#64748b",
                }}
              />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Example: Agent 001, TEP-0001, Supervisor 2"
                style={{ width: "100%", paddingLeft: "40px" }}
              />
            </div>
          </label>
        </div>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">Agent Table</span>
            <h2>Operational and Financial Agent Details</h2>
          </div>

          <div className="callout-pill">
            {formatNumber(sortedAgents.length)} records
          </div>
        </div>

        <div className="responsive-table tall-table">
          <table>
            <thead>
              <tr>
                <th>Agent</th>
                <th>Vendor</th>
                <th>Supervisor</th>
                <th>Schedule</th>
                <th>Login / Logout</th>
                <th>Calls</th>
                <th>AHT</th>
                <th>QA</th>
                <th>OCR</th>
                <th>Cost / Call</th>
                <th>Unproductive Hours</th>
                <th>Unproductive Cost</th>
              </tr>
            </thead>

            <tbody>
              {sortedAgents.map((agent) => (
                <tr key={agent.employeeId}>
                  <td>
                    <strong>{agent.name}</strong>
                    <br />
                    <span>{agent.employeeId}</span>
                  </td>

                  <td>{agent.vendor}</td>

                  <td>{agent.supervisor}</td>

                  <td>
                    {agent.scheduledStart} - {agent.scheduledEnd}
                    <br />
                    <span>{agent.workDate}</span>
                  </td>

                  <td>
                    {agent.actualLogin} - {agent.actualLogout}
                    <br />
                    <span>Status: {agent.status}</span>
                  </td>

                  <td>{formatNumber(agent.callsHandled)}</td>

                  <td>{formatNumber(agent.ahtSeconds)} sec</td>

                  <td>{Number(agent.qaScore || 0).toFixed(1)}%</td>

                  <td>
                    {Number(agent.ocrScore || agent.fcrScore || 0).toFixed(1)}%
                  </td>

                  <td>${Number(agent.costPerCall || 0).toFixed(2)}</td>

                  <td>
                    {Number(agent.unproductiveShrinkageHours || 0).toFixed(2)}
                  </td>

                  <td className="danger-text">
                    {formatMoney(
                      agent.costOfUnproductiveShrinkage ||
                        agent.costOfGeneralSlack ||
                        0
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">Data Needed From Call Centers</span>
            <h2>Fields Required to Make This Real</h2>
          </div>
        </div>

        <div className="formula-card">
          <span>Core WFM fields</span>
          <strong>
            Employee ID, Agent Name, Vendor, Supervisor, Scheduled Start,
            Scheduled End, Actual Login, Actual Logout, Break 1, Lunch, Break 2,
            Meetings, Training, System Downtime, Calls Handled, AHT, QA Score,
            OCR Score, Cost Per Call, and Hourly Rate.
          </strong>
        </div>

        <p className="muted">
          Once the real Google Sheet has these fields, the dashboard can show
          which vendors are overstaffed, where shrinkage is creating financial
          waste, which agents need coaching, and which call centers provide the
          strongest quality return for the cost.
        </p>
      </section>
    </div>
  );
}

export default AgentsPage;