// client/src/components/DataSourceBadge.jsx

import React from "react";
import { Database } from "lucide-react";

function DataSourceBadge({ source, generatedAt }) {
  const isGoogleSheet = source === "google-sheet";

  return (
    <div
      className="callout-pill"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <Database size={16} />
      Data Source: {isGoogleSheet ? "Google Sheet" : source || "Unknown"}
      {generatedAt ? ` · ${new Date(generatedAt).toLocaleString()}` : ""}
    </div>
  );
}

export default DataSourceBadge;