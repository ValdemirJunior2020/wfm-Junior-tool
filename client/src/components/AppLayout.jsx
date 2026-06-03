// client/src/components/AppLayout.jsx

import React from "react";
import { NavLink } from "react-router-dom";
import {
  BarChart3,
  Calculator,
  ClipboardCheck,
  ClipboardList,
  DollarSign,
  LayoutDashboard,
  Lightbulb,
  ScatterChart,
  Users,
} from "lucide-react";
import DataSourceBadge from "./DataSourceBadge.jsx";
import MusicPlayer from "./MusicPlayer.jsx";

function AppLayout({ children }) {
  const menuItems = [
    {
      label: "Executive Overview",
      path: "/overview",
      icon: <LayoutDashboard size={20} />,
    },
    {
      label: "Unproductive Shrinkage",
      path: "/slack-cost",
      icon: <DollarSign size={20} />,
    },
    {
      label: "Erlang C Savings",
      path: "/erlang-savings",
      icon: <Calculator size={20} />,
    },
    {
      label: "Quality vs Cost",
      path: "/quality-cost",
      icon: <ScatterChart size={20} />,
    },
    {
      label: "Agent Details",
      path: "/agents",
      icon: <Users size={20} />,
    },
    {
      label: "QA KPI Review",
      path: "/qa-kpi-review",
      icon: <ClipboardCheck size={20} />,
    },
    {
      label: "Data Requirements",
      path: "/data-requirements",
      icon: <ClipboardList size={20} />,
    },
    {
      label: "Why It Matters",
      path: "/why-it-matters",
      icon: <Lightbulb size={20} />,
    },
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-card">
          <div className="brand-icon">
            <BarChart3 size={28} />
          </div>

          <div>
            <h1>WFM Pro</h1>
            <p>Cost Intelligence</p>
          </div>
        </div>

        <nav className="nav-list">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive ? "nav-item nav-item-active" : "nav-item"
              }
            >
              <span className="nav-item-inner">
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <span>Demo Vendors</span>
          <strong>Tep · Concentrix · Buwelo-C · Buwelo-G · Telus · WNS</strong>
        </div>
      </aside>

      <main className="main-content">
        <MusicPlayer />

        <div className="page-logo-center">
          <img
            src="/logo.png"
            alt="Agent Utilization QA Management Logo"
            className="page-logo-main"
          />
        </div>

        <div className="global-data-source-row">
          <DataSourceBadge />
        </div>

        {children}
      </main>
    </div>
  );
}

export default AppLayout;