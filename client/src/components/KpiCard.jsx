// client/src/components/KpiCard.jsx
export default function KpiCard({ title, value, subtext, tone = "default" }) {
  return (
    <article className={`kpi-card ${tone}`}>
      <p>{title}</p>
      <h2>{value}</h2>
      {subtext && <span>{subtext}</span>}
    </article>
  );
}
