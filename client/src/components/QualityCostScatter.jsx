// client/src/components/QualityCostScatter.jsx
import { CartesianGrid, Legend, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from "recharts";
import { vendorColors, vendors } from "../data/mockDashboard.js";

export default function QualityCostScatter({ data }) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">Quality Return on Investment</span>
          <h2>Cost per Call vs QA/OCR Score</h2>
        </div>
      </div>

      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height={390}>
          <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 0 }}>
            <CartesianGrid />
            <XAxis type="number" dataKey="costPerCall" name="Cost per Call" unit="$" domain={[3, 4.2]} />
            <YAxis type="number" dataKey="qualityScore" name="QA/OCR Score" unit="%" domain={[82, 92]} />
            <ZAxis type="number" dataKey="monthlyCallVolume" range={[180, 420]} name="Monthly Volume" />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} formatter={(value, name) => [value, name]} />
            <Legend />
            {vendors.map((vendor) => (
              <Scatter key={vendor} name={vendor} data={data.filter((item) => item.vendor === vendor)} fill={vendorColors[vendor]} />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
