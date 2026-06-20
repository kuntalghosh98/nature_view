const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const auditRoutes = require("./routes/audit.routes");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "Nature View API is healthy" });
});

app.use("/api/auth", authRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/audit-logs", auditRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
});

app.use((error, _req, res, _next) => {
  const status = error.statusCode || 500;
  res.status(status).json({
    success: false,
    message: error.message || "Internal server error"
  });
});

module.exports = app;
