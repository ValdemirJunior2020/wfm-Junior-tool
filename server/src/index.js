// server/src/index.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import savingsRoutes from "./routes/savingsRoutes.js";
import googleSheetRoutes from "./routes/googleSheetRoutes.js";

const app = express();
const port = Number(process.env.PORT || 4000);

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));

app.get("/health", (req, res) => {
  res.json({ ok: true, service: "wfm-cost-dashboard-server" });
});

app.use("/api/dashboard", dashboardRoutes);
app.use("/api/savings", savingsRoutes);
app.use("/api/google-sheet", googleSheetRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.status || 500).json({ message: error.message || "Internal server error" });
});

app.listen(port, () => {
  console.log(`WFM Cost Dashboard API running on port ${port}`);
});
