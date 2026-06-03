// client/src/components/DataSourceBadge.jsx

import React from "react";
import { Database } from "lucide-react";

const FORCED_LAST_UPDATE = "Sunday 05/24/26";

function DataSourceBadge() {
  return (
    <div className="global-data-source-badge">
      <Database size={16} />
      <span>
        Data Source: <strong>Google Sheet</strong> · Last update:{" "}
        <strong>{FORCED_LAST_UPDATE}</strong>
      </span>
    </div>
  );
}

export default DataSourceBadge;