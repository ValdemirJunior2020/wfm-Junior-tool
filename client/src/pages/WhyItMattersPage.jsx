// client/src/pages/WhyItMattersPage.jsx

import React from "react";
import {
  BadgeDollarSign,
  BarChart3,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Eye,
  FileSearch,
  Handshake,
  LineChart,
  ShieldCheck,
  Target,
  TrendingDown,
} from "lucide-react";

const valueCards = [
  {
    emoji: "🛡️",
    title: "Independent Vendor Accountability",
    colorClass: "value-card-blue",
    icon: <ShieldCheck size={28} />,
    description:
      "The call centers should track their own performance, but our company also needs an internal way to validate what they report.",
    example:
      "If a vendor says they need 108 agents, this tool helps us verify if the math supports that number.",
  },
  {
    emoji: "💰",
    title: "Protect Company Money",
    colorClass: "value-card-green",
    icon: <BadgeDollarSign size={28} />,
    description:
      "This dashboard turns staffing, shrinkage, and productivity into real financial impact leadership can understand.",
    example:
      "Instead of saying “there may be waste,” we can show estimated monthly and annual savings opportunities.",
  },
  {
    emoji: "📊",
    title: "Compare Vendors Fairly",
    colorClass: "value-card-purple",
    icon: <BarChart3 size={28} />,
    description:
      "Each BPO may report data differently. This tool puts Tep, Concentrix, Buwelo, and Telus into one standard view.",
    example:
      "Same fields. Same calculations. Same scorecard. Same executive view.",
  },
  {
    emoji: "🎯",
    title: "Connect QA With Cost",
    colorClass: "value-card-orange",
    icon: <Target size={28} />,
    description:
      "A cheap vendor is not always the best vendor. An expensive vendor is not always bad. This tool connects cost with QA and OCR.",
    example:
      "Leadership can see who gives the best quality return for the money spent.",
  },
  {
    emoji: "🔍",
    title: "Validate Staffing Requests",
    colorClass: "value-card-pink",
    icon: <FileSearch size={28} />,
    description:
      "When a call center asks for more agents, we can ask for the data behind the request: volume, AHT, shrinkage, occupancy, and service level.",
    example:
      "This helps avoid approving extra staffing only because the vendor says it is needed.",
  },
  {
    emoji: "⏱️",
    title: "Find Unproductive Shrinkage",
    colorClass: "value-card-yellow",
    icon: <TrendingDown size={28} />,
    description:
      "The tool highlights paid time that is not directly supporting calls: extra breaks, lunch overages, downtime, meetings, coaching, and unavailable time.",
    example:
      "Small daily time losses can become large monthly financial waste.",
  },
  {
    emoji: "📋",
    title: "Create One Standard Data Format",
    colorClass: "value-card-cyan",
    icon: <ClipboardCheck size={28} />,
    description:
      "The tool gives every call center a clear structure for what data must be provided weekly.",
    example:
      "Agent, schedule, login, logout, breaks, lunch, downtime, calls, AHT, QA, OCR, and cost per call.",
  },
  {
    emoji: "🤝",
    title: "Stronger Vendor Conversations",
    colorClass: "value-card-indigo",
    icon: <Handshake size={28} />,
    description:
      "This is not about attacking vendors. It gives us better data to coach, challenge, negotiate, and improve performance together.",
    example:
      "The conversation becomes data-driven instead of opinion-based.",
  },
];

function WhyItMattersPage() {
  return (
    <div className="page-stack">
      <section className="page-header">
        <span className="eyebrow">Why This Tool Matters</span>
        <h1>Why This Dashboard Is Valuable for the Company 🚀</h1>
        <p>
          The call centers should absolutely track their own WFM, staffing,
          shrinkage, QA, and productivity. But our company also needs an
          independent validation layer so we can verify what vendors report,
          compare them fairly, and protect the business financially.
        </p>
      </section>

      <section className="insight-banner">
        <div>
          <span>Executive Positioning</span>
          <strong>Vendor Performance & Cost Validation</strong>
        </div>

        <p>
          This tool is not replacing the call center’s WFM team. It gives our
          company an internal control layer to validate staffing, cost,
          shrinkage, quality, OCR, and vendor efficiency using the same standard
          across all BPOs.
        </p>
      </section>

      <section className="value-hero-grid">
        <div className="value-hero-card value-hero-primary">
          <div className="value-hero-icon">🏢</div>
          <div>
            <span>Company Benefit</span>
            <h2>We stop depending only on the vendor’s version of the truth.</h2>
            <p>
              Vendors can still provide their reports, but this dashboard lets
              us verify, compare, and challenge the numbers with our own
              standardized view.
            </p>
          </div>
        </div>

        <div className="value-hero-card value-hero-success">
          <div className="value-hero-icon">💵</div>
          <div>
            <span>Financial Benefit</span>
            <h2>We can identify avoidable cost before it becomes normal.</h2>
            <p>
              Overstaffing, unproductive shrinkage, and poor utilization can
              quietly become part of the invoice. This tool makes those issues
              visible.
            </p>
          </div>
        </div>
      </section>

      <section className="value-card-grid">
        {valueCards.map((card) => (
          <article className={`value-card ${card.colorClass}`} key={card.title}>
            <div className="value-card-top">
              <div className="value-emoji">{card.emoji}</div>
              <div className="value-icon">{card.icon}</div>
            </div>

            <h2>{card.title}</h2>
            <p>{card.description}</p>

            <div className="value-example">
              <span>Example</span>
              <strong>{card.example}</strong>
            </div>
          </article>
        ))}
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">Simple Explanation for Leadership</span>
            <h2>How to Explain This Tool</h2>
          </div>

          <Building2 size={34} />
        </div>

        <div className="leadership-script">
          <p>
            <strong>“This dashboard does not replace the call center’s WFM reporting.</strong>{" "}
            It gives us an internal validation layer so we can compare vendors
            using the same standards, connect quality performance to cost,
            identify possible overstaffing or unproductive shrinkage, and have
            stronger data-driven conversations about invoices, staffing, and
            service quality.”
          </p>
        </div>
      </section>

      <section className="value-flow">
        <div className="value-flow-step">
          <Eye size={28} />
          <span>1</span>
          <h3>See</h3>
          <p>Collect the same data from every vendor.</p>
        </div>

        <div className="value-flow-step">
          <LineChart size={28} />
          <span>2</span>
          <h3>Compare</h3>
          <p>Review staffing, cost, QA, OCR, and shrinkage side by side.</p>
        </div>

        <div className="value-flow-step">
          <FileSearch size={28} />
          <span>3</span>
          <h3>Validate</h3>
          <p>Check if vendor staffing and cost assumptions make sense.</p>
        </div>

        <div className="value-flow-step">
          <CheckCircle2 size={28} />
          <span>4</span>
          <h3>Act</h3>
          <p>Coach, challenge, negotiate, and improve performance.</p>
        </div>
      </section>

      <section className="insight-banner">
        <div>
          <span>Bottom Line</span>
          <strong>QA + WFM + Finance = Stronger Control</strong>
        </div>

        <p>
          This moves the conversation from “What is the QA score?” to “What is
          the quality, cost, staffing efficiency, and financial impact of each
          vendor?” That is the type of view executive leadership can use.
        </p>
      </section>
    </div>
  );
}

export default WhyItMattersPage;