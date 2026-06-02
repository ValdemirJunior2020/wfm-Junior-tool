// client/src/pages/DataRequirementsPage.jsx

import React from "react";
import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  Clock,
  Database,
  FileSpreadsheet,
  Headphones,
  LineChart,
  ShieldCheck,
  Users,
} from "lucide-react";

const GOOGLE_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1AO5cK9QpQP4hW5s-C53b1IcPkZoRGA_nDyigN_rDRr0/edit?usp=sharing";

const requiredDataSections = [
  {
    title: "Agent Master Data",
    icon: <Users size={24} />,
    purpose:
      "Identifies who the agent is, which vendor owns the agent, who supervises them, and what hourly cost should be applied.",
    fields: [
      "Employee ID",
      "Agent full name",
      "Vendor / BPO name",
      "Supervisor name",
      "Team / queue",
      "Agent status: Active, Inactive, Training, LOA",
      "Hire date",
      "Hourly rate or fully loaded hourly cost",
      "Role type: Voice, Chat, Email, Back Office, QA, Lead",
    ],
  },
  {
    title: "Schedule Data",
    icon: <CalendarClock size={24} />,
    purpose:
      "Shows what each agent was planned to work, so the tool can compare scheduled time against real login behavior.",
    fields: [
      "Work date",
      "Scheduled start time",
      "Scheduled end time",
      "Scheduled paid hours",
      "Scheduled lunch start",
      "Scheduled lunch end",
      "Scheduled break 1 start",
      "Scheduled break 1 end",
      "Scheduled break 2 start",
      "Scheduled break 2 end",
      "Scheduled meeting time",
      "Scheduled training time",
      "Scheduled queue assignment",
    ],
  },
  {
    title: "Actual Login / Logout Data",
    icon: <Clock size={24} />,
    purpose:
      "Shows what actually happened versus what was scheduled. This is required for adherence and shrinkage analysis.",
    fields: [
      "Actual login time",
      "Actual logout time",
      "Actual paid time",
      "Late login minutes",
      "Early logout minutes",
      "Total time logged into system",
      "Total time available",
      "Total time unavailable",
      "Aux / unavailable reason codes",
      "Time in queue",
      "Time out of queue",
    ],
  },
  {
    title: "Break, Lunch, Meeting, and Downtime Data",
    icon: <AlertTriangle size={24} />,
    purpose:
      "This is the heart of the Cost of General Slack calculation. It shows paid time that did not directly support calls.",
    fields: [
      "Break 1 start",
      "Break 1 end",
      "Break 1 duration",
      "Break 1 overage minutes",
      "Lunch start",
      "Lunch end",
      "Lunch duration",
      "Lunch overage minutes",
      "Break 2 start",
      "Break 2 end",
      "Break 2 duration",
      "Break 2 overage minutes",
      "Meeting minutes",
      "Training minutes",
      "Coaching minutes",
      "System downtime minutes",
      "Tool issue minutes",
      "Waiting for work minutes",
      "Unproductive shrinkage hours",
    ],
  },
  {
    title: "Call Volume and Productivity Data",
    icon: <Headphones size={24} />,
    purpose:
      "Needed to calculate productivity, cost per call, Erlang C staffing needs, and whether labor is being used efficiently.",
    fields: [
      "Calls offered",
      "Calls answered",
      "Calls missed",
      "Calls abandoned",
      "Calls handled by agent",
      "Average handle time seconds",
      "Talk time",
      "Hold time",
      "After-call work time",
      "Transfer count",
      "Repeat call count",
      "Occupancy percentage",
      "Utilization percentage",
      "Service level target",
      "Actual service level",
    ],
  },
  {
    title: "Quality and Customer Outcome Data",
    icon: <ShieldCheck size={24} />,
    purpose:
      "Required for the Quality vs Cost scatter plot. This prevents leadership from looking only at cost and ignoring quality.",
    fields: [
      "QA score",
      "QA form type",
      "QA evaluator",
      "QA date",
      "Pass / Fail",
      "Markdown reason",
      "First Call Resolution score",
      "Repeat call reason",
      "Escalation count",
      "Refund error count",
      "Reservation handling accuracy",
      "Customer sentiment",
      "CSAT score if available",
      "Complaint count",
    ],
  },
  {
    title: "Financial and Billing Data",
    icon: <LineChart size={24} />,
    purpose:
      "Needed to translate operational behavior into financial impact for executive leadership.",
    fields: [
      "Vendor billed agents",
      "Vendor billed hours",
      "Vendor hourly rate",
      "Fully loaded hourly rate",
      "Monthly invoice amount",
      "Cost per call",
      "Cost per productive hour",
      "Cost per available hour",
      "Overtime hours",
      "Overtime cost",
      "Monthly waste",
      "Estimated monthly savings",
      "Estimated annual savings",
    ],
  },
  {
    title: "Erlang C / Staffing Requirement Data",
    icon: <Database size={24} />,
    purpose:
      "Needed to compare vendor staffing estimates against mathematical staffing requirements.",
    fields: [
      "Interval date",
      "Interval start time",
      "Interval end time",
      "Calls offered per interval",
      "Average handle time per interval",
      "Target service level",
      "Target answer time",
      "Shrinkage percentage",
      "Occupancy target",
      "Current billed agents",
      "Optimized required agents",
      "Agent gap",
      "Required FTE",
      "Scheduled FTE",
    ],
  },
];

function DataRequirementsPage() {
  return (
    <div className="page-stack">
      <section className="page-header">
        <span className="eyebrow">Data Requirements</span>
        <h1>What We Need From the Call Centers to Make This Tool Work</h1>
        <p>
          This page explains the exact data required from Tep, Concentrix,
          Buwelo, and Telus to turn this demo into a highly professional
          workforce management and financial waste dashboard.
        </p>
      </section>

      <section className="insight-banner">
        <div>
          <span>Important Demo Disclaimer</span>
          <strong>Mock Data Only</strong>
        </div>

        <p>
          The numbers currently shown in this dashboard are mock examples for
          demonstration purposes only. They are not real production results,
          real vendor invoices, real agent records, or real financial findings.
          The dashboard becomes accurate only after the call centers provide the
          required source data.
        </p>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">Current Data Source</span>
            <h2>Google Sheet Used for This Boilerplate Demo</h2>
          </div>

          <FileSpreadsheet size={34} />
        </div>

        <p className="muted">
          The sample data structure for this dashboard is connected to the WFM
          Google Sheet below. This sheet is being used as the sample source to
          demonstrate how the dashboard can read workforce, vendor, quality, and
          financial data.
        </p>

        <div className="formula-card">
          <span>Google Sheet Source</span>
          <strong>
            <a href={GOOGLE_SHEET_URL} target="_blank" rel="noreferrer">
              Open WFM Google Sheet
            </a>
          </strong>
        </div>

        <p className="muted">
          Recommended tabs inside the Google Sheet: <strong>Agents</strong>,{" "}
          <strong>Daily_Time_Log</strong>,{" "}
          <strong>Vendor_Monthly_Metrics</strong>, and{" "}
          <strong>Savings_Audit_Log</strong>.
        </p>
      </section>

      <section className="kpi-grid">
        <div className="kpi-card">
          <p>Primary Goal</p>
          <h2>Visibility</h2>
          <span>Show where staffing and paid time are creating waste.</span>
        </div>

        <div className="kpi-card success">
          <p>Executive Value</p>
          <h2>Savings</h2>
          <span>Estimate monthly and annual financial opportunities.</span>
        </div>

        <div className="kpi-card warning">
          <p>Operational Value</p>
          <h2>Control</h2>
          <span>Track adherence, shrinkage, utilization, and productivity.</span>
        </div>

        <div className="kpi-card danger">
          <p>Data Status</p>
          <h2>Demo</h2>
          <span>Current values are examples only, not real vendor data.</span>
        </div>
      </section>

      {requiredDataSections.map((section) => (
        <section className="panel" key={section.title}>
          <div className="panel-heading">
            <div>
              <span className="eyebrow">Required Data</span>
              <h2>
                {section.icon} {section.title}
              </h2>
            </div>
          </div>

          <p className="muted">{section.purpose}</p>

          <div className="responsive-table">
            <table>
              <thead>
                <tr>
                  <th>Field Needed</th>
                  <th>Why It Matters</th>
                </tr>
              </thead>

              <tbody>
                {section.fields.map((field) => (
                  <tr key={field}>
                    <td>
                      <strong>{field}</strong>
                    </td>
                    <td>
                      Used to calculate staffing accuracy, shrinkage, waste,
                      quality ROI, productivity, or savings opportunity.
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}

      <section className="panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">Minimum Weekly File Needed</span>
            <h2>What Each Call Center Should Send Every Week</h2>
          </div>
        </div>

        <div className="formula-card">
          <span>Weekly requirement</span>
          <strong>
            One row per agent per day with schedule, actual login/logout,
            break/lunch details, unavailable time, calls handled, AHT, QA, FCR,
            and cost data.
          </strong>
        </div>

        <p className="muted">
          The cleanest process is for each vendor to send a standardized file
          every Monday covering the previous 7 days. The dashboard can then
          refresh the Google Sheet and update the executive view automatically.
        </p>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">Recommended Data Rules</span>
            <h2>To Keep the Tool Accurate</h2>
          </div>
        </div>

        <div className="responsive-table">
          <table>
            <thead>
              <tr>
                <th>Rule</th>
                <th>Reason</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>
                  <strong>Use one Employee ID per agent</strong>
                </td>
                <td>
                  Prevents duplicate agents and keeps historical tracking clean.
                </td>
              </tr>

              <tr>
                <td>
                  <strong>Use the same vendor names every time</strong>
                </td>
                <td>
                  Vendor names must stay consistent: Tep, Concentrix, Buwelo,
                  and Telus.
                </td>
              </tr>

              <tr>
                <td>
                  <strong>Use 24-hour time format</strong>
                </td>
                <td>
                  Example: 08:00, 12:30, 17:00. This makes break and login math
                  cleaner.
                </td>
              </tr>

              <tr>
                <td>
                  <strong>One row per agent per work date</strong>
                </td>
                <td>
                  This keeps daily adherence, productivity, and cost tracking
                  simple.
                </td>
              </tr>

              <tr>
                <td>
                  <strong>No merged cells</strong>
                </td>
                <td>
                  Merged cells break dashboards, formulas, imports, and exports.
                </td>
              </tr>

              <tr>
                <td>
                  <strong>Required fields cannot be blank</strong>
                </td>
                <td>
                  Missing login, logout, vendor, schedule, or cost fields will
                  create inaccurate savings results.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="insight-banner">
        <div>
          <span>Final Message</span>
          <strong>
            <CheckCircle2 size={30} /> Ready for Real Data
          </strong>
        </div>

        <p>
          Once the vendors provide these fields consistently, this dashboard can
          become a real executive WFM tool showing cost of inefficiency, Erlang
          staffing gaps, agent utilization, shrinkage waste, vendor comparison,
          and quality return on investment.
        </p>
      </section>
    </div>
  );
}

export default DataRequirementsPage;