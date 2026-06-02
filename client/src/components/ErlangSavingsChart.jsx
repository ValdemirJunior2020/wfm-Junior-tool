// client/src/components/ErlangSavingsChart.jsx
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export default function ErlangSavingsChart({ data }) {
  const totalSavings = data.reduce((sum, item) => sum + Number(item.monthlySavings || 0), 0);

  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">Erlang C Staffing Gap</span>
          <h2>Current Billed Agents vs Optimized Requirement</h2>
        </div>
        <div className="callout-pill">Savings: {currency.format(totalSavings)}</div>
      </div>

      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height={360}>
          <BarChart data={data} margin={{ top: 16, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="vendor" />
            <YAxis />
            <Tooltip formatter={(value) => [value, "Agents"]} />
            <Legend />
            <Bar dataKey="currentBilledAgents" name="Current Billed Agents" fill="#0f172a" radius={[8, 8, 0, 0]} />
            <Bar dataKey="optimizedRequiredAgents" name="Optimized Required Agents" fill="#22c55e" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
