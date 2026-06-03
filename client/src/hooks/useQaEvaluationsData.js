// client/src/hooks/useQaEvaluationsData.js

import { useEffect, useMemo, useState } from "react";
import { getQaEvaluationsData } from "../services/api.js";

function normalizeQaType(value) {
  const text = String(value || "").trim().toLowerCase();

  if (text.includes("group")) {
    return "Groups";
  }

  return "Customer Service";
}

function normalizeQaRow(row, index) {
  const qaType = normalizeQaType(row.qaType);
  const qaScore = Number(row.qaScore || 0);

  const kpiTarget =
    Number(row.kpiTarget || 0) ||
    (qaType === "Groups" ? 85 : 90);

  const gapToTarget = Number((qaScore - kpiTarget).toFixed(2));
  const passed = qaScore >= kpiTarget;

  return {
    id: row.id || index + 1,
    timestamp: row.timestamp || "",
    qaDate: row.qaDate || "",
    agentName: row.agentName || "",
    employeeId: row.employeeId || "",
    vendor: row.vendor || "",
    supervisor: row.supervisor || "",
    qaType,
    qaScore,
    kpiTarget,
    result: row.result || (passed ? "PASS" : "FAIL"),
    passed,
    gapToTarget,
    callId: row.callId || "",
    requestId: row.requestId || "",
    itinerary: row.itinerary || "",
    callLength: row.callLength || "",
    evaluator: row.evaluator || "",
    markdownReason: row.markdownReason || "",
    notes: row.notes || "",
  };
}

export function useQaEvaluationsData() {
  const [state, setState] = useState({
    loading: true,
    error: "",
    source: "",
    generatedAt: "",
    qaEvaluations: [],
  });

  useEffect(() => {
    let mounted = true;

    async function loadQaData() {
      try {
        const data = await getQaEvaluationsData();

        if (!mounted) return;

        setState({
          loading: false,
          error: "",
          source: data.source || "google-sheet",
          generatedAt: data.generatedAt || "",
          qaEvaluations: data.qaEvaluations.map(normalizeQaRow),
        });
      } catch (error) {
        if (!mounted) return;

        setState({
          loading: false,
          error: error.message,
          source: "error",
          generatedAt: "",
          qaEvaluations: [],
        });
      }
    }

    loadQaData();

    return () => {
      mounted = false;
    };
  }, []);

  const vendors = useMemo(() => {
    return Array.from(
      new Set(
        state.qaEvaluations
          .map((row) => row.vendor)
          .filter((vendor) => vendor && vendor.trim() !== "")
      )
    );
  }, [state.qaEvaluations]);

  return {
    ...state,
    vendors,
  };
}