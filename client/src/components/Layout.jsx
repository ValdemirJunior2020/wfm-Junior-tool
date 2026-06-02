// client/src/components/Layout.jsx
import { NavLink, Outlet } from "react-router-dom";
import { BarChart3, Calculator, ClipboardList, DollarSign, Gauge, ScatterChart } from "lucide-react";

const navItems = [
  { to: "/", label: "Executive Overview", icon: Gauge },
  { to: "/cost-of-slack", label: "Cost of Slack", icon: DollarSign },
  { to: "/erlang-savings", label: "Erlang Savings", icon: Calculator },
  { to: "/quality-cost", label: "Quality ROI", icon: ScatterChart },
  { to: "/agents", label: "Agent Details", icon: ClipboardList }
];

export default function Layout() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-card">
          <div className="brand-icon"><BarChart3 size={26} /></div>
          <div>
            <h1>WFM Pro</h1>
            <p>Executive Cost Intelligence</p>
          </div>
        </div>

        <nav className="nav-list">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === "/"} className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
              <Icon size={19} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <strong>Vendors</strong>
          <span>Tep • Concentrix • Buwelo • Telus</span>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
