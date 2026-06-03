// client/src/pages/QAKpiReviewPage.jsx

import React, { useMemo, useState } from "react";
import {
  AlertTriangle,
  Award,
  CheckCircle2,
  ClipboardCheck,
  Search,
  Target,
  XCircle,
} from "lucide-react";
import { useQaEvaluationsData } from "../hooks/useQaEvaluationsData.js";
import DataSourceBadge from "../components/DataSourceBadge.jsx";

const QA_TYPES = ["All QA Types", "Customer Service", "Groups"];

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(Number(value || 0));
}

function percent(value) {
  return `${Number(value || 0).toFixed(1)}%`;
}

function getResultClass(passed) {
  return passed ? "qa-pass-badge" : "qa-fail-badge";
}

function QAKpiReviewPage() {
  const { loading, error, source, generatedAt, qaEvaluations, vendors } =
    useQaEvaluationsData();

  const [selectedVendor, setSelectedVendor] = useState("All Vendors");
  const [selectedQaType, setSelectedQaType] = useState("All QA Types");
  const [resultFilter, setResultFilter] = useState("All Results");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRows = useMemo(() => {
    return qaEvaluations.filter((row) => {
      const matchesVendor =
        selectedVendor === "All Vendors" || row.vendor === selectedVendor;

      const matchesQaType =
        selectedQaType === "All QA Types" || row.qaType === selectedQaType;

      const matchesResult =
        resultFilter === "All Results" ||
        (resultFilter === "PASS" && row.passed) ||
        (resultFilter === "FAIL" && !row.passed);

      const search = searchTerm.toLowerCase().trim();

      const matchesSearch =
        !search ||
        row.agentName.toLowerCase().includes(search) ||
        row.employeeId.toLowerCase().includes(search) ||
        row.vendor.toLowerCase().includes(search) ||
        row.supervisor.toLowerCase().includes(search) ||
        row.callId.toLowerCase().includes(search) ||
        row.requestId.toLowerCase().includes(search) ||
        row.itinerary.toLowerCase().includes(search) ||
        row.evaluator.toLowerCase().includes(search);

      return matchesVendor && matchesQaType && matchesResult && matchesSearch;
    });
  }, [
    qaEvaluations,
    selectedVendor,
    selectedQaType,
    resultFilter,
    searchTerm,
  ]);

  const totals = useMemo(() => {
    const total = filteredRows.length;
    const passed = filteredRows.filter((row) => row.passed).length;
    const failed = total - passed;

    const avgScore =
      total > 0
        ? filteredRows.reduce((sum, row) => sum + Number(row.qaScore || 0), 0) /
          total
        : 0;

    const passRate = total > 0 ? (passed / total) * 100 : 0;

    const csRows = filteredRows.filter(
      (row) => row.qaType === "Customer Service"
    );

    const groupsRows = filteredRows.filter((row) => row.qaType === "Groups");

    const csPassRate =
      csRows.length > 0
        ? (csRows.filter((row) => row.passed).length / csRows.length) * 100
        : 0;

    const groupsPassRate =
      groupsRows.length > 0
        ? (groupsRows.filter((row) => row.passed).length / groupsRows.length) *
          100
        : 0;

    return {
      total,
      passed,
      failed,
      avgScore,
      passRate,
      csTotal: csRows.length,
      groupsTotal: groupsRows.length,
      csPassRate,
      groupsPassRate,
    };
  }, [filteredRows]);

  const lowestGapRows = useMemo(() => {
    return [...filteredRows]
      .filter((row) => !row.passed)
      .sort((a, b) => a.gapToTarget - b.gapToTarget)
      .slice(0, 8);
  }, [filteredRows]);

  if (loading) {
    return (
      <div className="overview-loading-shell">
        <div className="overview-loading-card">
          <span className="eyebrow">Loading QA KPI Review</span>
          <h1>Loading QA Scores from Google Sheet...</h1>
          <p>
            Reading the QA_Evaluations tab and comparing Customer Service scores
            against 90% and Groups scores against 85%.
          </p>

          <div className="loading-progress-bar">
            <div className="loading-progress-fill" />
          </div>

          <div className="loading-steps">
            <span>✅ Reading QA_Evaluations</span>
            <span>🎯 Applying KPI targets</span>
            <span>📊 Calculating pass/fail</span>
            <span>🚀 Preparing QA dashboard</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-stack">
        <section className="page-header">
          <span className="eyebrow">QA Google Sheet Error</span>
          <h1>Could Not Load QA KPI Data</h1>
          <p>{error}</p>
        </section>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <section className="page-header">
        <span className="eyebrow">QA KPI Review</span>
        <h1>QA Scores vs KPI Targets</h1>
        <p>
          This page shows whether agents are meeting your QA KPI rules:
          Customer Service must reach 90%, and Groups must reach 85%.
        </p>

        <div style={{ marginTop: "18px" }}>
          <DataSourceBadge source={source} generatedAt={generatedAt} />
        </div>
      </section>

      <section className="insight-banner">
        <div>
          <span>KPI Rules</span>
          <strong>CS 90% · Groups 85%</strong>
        </div>

        <p>
          Every QA score is automatically compared against the correct target
          based on the QA Type. This helps quickly identify passing agents,
          failing agents, coaching priorities, and vendor-level QA risk.
        </p>
      </section>

      <section className="kpi-grid">
        <div className="kpi-card">
          <p>
            <ClipboardCheck size={18} /> Evaluations Reviewed
          </p>
          <h2>{formatNumber(totals.total)}</h2>
          <span>Total QA evaluations in the selected view.</span>
        </div>

        <div className="kpi-card success">
          <p>
            <CheckCircle2 size={18} /> Passing
          </p>
          <h2>{formatNumber(totals.passed)}</h2>
          <span>{percent(totals.passRate)} pass rate.</span>
        </div>

        <div className="kpi-card danger">
          <p>
            <XCircle size={18} /> Failing
          </p>
          <h2>{formatNumber(totals.failed)}</h2>
          <span>Evaluations below the required KPI target.</span>
        </div>

        <div className="kpi-card warning">
          <p>
            <Award size={18} /> Average QA Score
          </p>
          <h2>{percent(totals.avgScore)}</h2>
          <span>Average QA score for selected records.</span>
        </div>
      </section>

      <section className="kpi-grid">
        <div className="kpi-card success">
          <p>Customer Service Target</p>
          <h2>90%</h2>
          <span>
            {formatNumber(totals.csTotal)} CS evaluations ·{" "}
            {percent(totals.csPassRate)} pass rate.
          </span>
        </div>

        <div className="kpi-card warning">
          <p>Groups Target</p>
          <h2>85%</h2>
          <span>
            {formatNumber(totals.groupsTotal)} Groups evaluations ·{" "}
            {percent(totals.groupsPassRate)} pass rate.
          </span>
        </div>

        <div className="kpi-card">
          <p>
            <Target size={18} /> Selected QA Type
          </p>
          <h2>{selectedQaType}</h2>
          <span>Current QA type filter.</span>
        </div>

        <div className="kpi-card">
          <p>Selected Vendor</p>
          <h2>{selectedVendor}</h2>
          <span>Current vendor filter.</span>
        </div>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">Filters</span>
            <h2>Search and Filter QA Evaluations</h2>
          </div>
        </div>

        <div className="qa-filter-grid">
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
            QA Type
            <select
              value={selectedQaType}
              onChange={(event) => setSelectedQaType(event.target.value)}
            >
              {QA_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

          <label>
            Result
            <select
              value={resultFilter}
              onChange={(event) => setResultFilter(event.target.value)}
            >
              <option value="All Results">All Results</option>
              <option value="PASS">PASS</option>
              <option value="FAIL">FAIL</option>
            </select>
          </label>

          <label>
            Search
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
                placeholder="Agent, ID, call ID, request ID, itinerary..."
                style={{ width: "100%", paddingLeft: "40px" }}
              />
            </div>
          </label>
        </div>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">QA KPI Table</span>
            <h2>Agent QA Results</h2>
          </div>

          <div className="callout-pill">
            {formatNumber(filteredRows.length)} records
          </div>
        </div>

        <div className="responsive-table tall-table">
          <table>
            <thead>
              <tr>
                <th>QA Date</th>
                <th>Agent</th>
                <th>Vendor</th>
                <th>QA Type</th>
                <th>QA Score</th>
                <th>KPI Target</th>
                <th>Result</th>
                <th>Gap</th>
                <th>Call ID</th>
                <th>Request ID</th>
                <th>Itinerary</th>
                <th>Evaluator</th>
                <th>Markdown Reason</th>
              </tr>
            </thead>

            <tbody>
              {filteredRows.map((row) => (
                <tr key={`${row.id}-${row.employeeId}-${row.callId}`}>
                  <td>{row.qaDate}</td>

                  <td>
                    <strong>{row.agentName}</strong>
                    <br />
                    <span>{row.employeeId}</span>
                  </td>

                  <td>{row.vendor}</td>
                  <td>{row.qaType}</td>
                  <td>{percent(row.qaScore)}</td>
                  <td>{percent(row.kpiTarget)}</td>

                  <td>
                    <span className={getResultClass(row.passed)}>
                      {row.passed ? "PASS" : "FAIL"}
                    </span>
                  </td>

                  <td
                    className={
                      row.gapToTarget >= 0 ? "qa-gap-good" : "qa-gap-bad"
                    }
                  >
                    {row.gapToTarget >= 0 ? "+" : ""}
                    {percent(row.gapToTarget)}
                  </td>

                  <td>{row.callId}</td>
                  <td>{row.requestId}</td>
                  <td>{row.itinerary}</td>
                  <td>{row.evaluator}</td>
                  <td>{row.markdownReason || row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {lowestGapRows.length > 0 && (
        <section className="panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">Coaching Priority</span>
              <h2>Lowest Gaps to KPI Target</h2>
            </div>

            <AlertTriangle size={34} />
          </div>

          <div className="responsive-table">
            <table>
              <thead>
                <tr>
                  <th>Agent</th>
                  <th>Vendor</th>
                  <th>QA Type</th>
                  <th>Score</th>
                  <th>Target</th>
                  <th>Gap</th>
                  <th>Reason</th>
                </tr>
              </thead>

              <tbody>
                {lowestGapRows.map((row) => (
                  <tr key={`priority-${row.id}-${row.employeeId}`}>
                    <td>
                      <strong>{row.agentName}</strong>
                      <br />
                      <span>{row.employeeId}</span>
                    </td>

                    <td>{row.vendor}</td>
                    <td>{row.qaType}</td>
                    <td>{percent(row.qaScore)}</td>
                    <td>{percent(row.kpiTarget)}</td>
                    <td className="qa-gap-bad">{percent(row.gapToTarget)}</td>
                    <td>{row.markdownReason || row.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

export default QAKpiReviewPage;