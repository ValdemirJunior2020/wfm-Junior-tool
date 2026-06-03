// client/src/App.jsx

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AppLayout from "./components/AppLayout.jsx";
import OverviewPage from "./pages/OverviewPage.jsx";
import SlackCostPage from "./pages/SlackCostPage.jsx";
import ErlangSavingsPage from "./pages/ErlangSavingsPage.jsx";
import QualityCostPage from "./pages/QualityCostPage.jsx";
import AgentsPage from "./pages/AgentsPage.jsx";
import DataRequirementsPage from "./pages/DataRequirementsPage.jsx";
import WhyItMattersPage from "./pages/WhyItMattersPage.jsx";

function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/overview" replace />} />
        <Route path="/overview" element={<OverviewPage />} />
        <Route path="/slack-cost" element={<SlackCostPage />} />
        <Route path="/erlang-savings" element={<ErlangSavingsPage />} />
        <Route path="/quality-cost" element={<QualityCostPage />} />
        <Route path="/agents" element={<AgentsPage />} />
        <Route path="/data-requirements" element={<DataRequirementsPage />} />
        <Route path="/why-it-matters" element={<WhyItMattersPage />} />
      </Routes>
    </AppLayout>
  );
}

export default App;