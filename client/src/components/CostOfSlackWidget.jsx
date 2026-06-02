// client/src/components/CostOfSlackWidget.jsx
import { useMemo, useState } from "react";
import { vendorSummary } from "../data/mockDashboard.js";

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export default function CostOfSlackWidget() {
  const [selectedVendor, setSelectedVendor] = useState("Tep");
  const [hourlyRate, setHourlyRate] = useState(17.75);
  const [shrinkageHours, setShrinkageHours] = useState(620);

  const cost = useMemo(() => hourlyRate * shrinkageHours, [hourlyRate, shrinkageHours]);

  function applyVendor(vendor) {
    const data = vendorSummary.find((item) => item.vendor === vendor);
    setSelectedVendor(vendor);
    setHourlyRate(data.avgHourlyRate);
    setShrinkageHours(data.unproductiveShrinkageHours);
  }

  return (
    <section className="panel cost-panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">Cost of Inefficiency</span>
          <h2>Cost of General Slack</h2>
        </div>
        <select value={selectedVendor} onChange={(event) => applyVendor(event.target.value)}>
          {vendorSummary.map((item) => <option key={item.vendor}>{item.vendor}</option>)}
        </select>
      </div>

      <div className="cost-grid">
        <label>
          Average Hourly Rate
          <input type="number" min="0" step="0.25" value={hourlyRate} onChange={(event) => setHourlyRate(Number(event.target.value))} />
        </label>
        <label>
          Unproductive Shrinkage Hours
          <input type="number" min="0" step="1" value={shrinkageHours} onChange={(event) => setShrinkageHours(Number(event.target.value))} />
        </label>
      </div>

      <div className="formula-card">
        <span>Formula</span>
        <strong>Hourly Rate × Unproductive Shrinkage Hours</strong>
      </div>

      <div className="big-money">{currency.format(cost)}</div>
      <p className="muted">Estimated monthly waste caused by excessive breaks, system downtime, non-productive meetings, and general Slack dependency.</p>
    </section>
  );
}
