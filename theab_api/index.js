const express = require("express");
const cors = require("cors");
const config = require("./src/config");
const { errorHandler, notFoundHandler } = require("./src/middleware/errorHandler");

// Import route handlers
const authRouter = require("./src/routes/auth");
const projectsRouter = require("./src/routes/projects");
const guestsRouter = require("./src/routes/guests");
const expensesRouter = require("./src/routes/expenses");
const giftsRouter = require("./src/routes/gifts");
const templateRouter = require("./src/routes/template");

const app = express();

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        config.FRONTEND_URL,
        "http://localhost:3000",
        "http://127.0.0.1:3000",
      ];

      if (allowedOrigins.includes(origin) || process.env.NODE_ENV === "development") {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Lightweight request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`[HTTP] ${req.method} ${req.originalUrl} ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Root welcome & API health check
app.get("/", (req, res) => {
  res.json({
    service: "Somboth Wedding & Event Management API",
    version: "1.0.0",
    status: "Healthy",
    docs: "/api/health",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    service: "Somboth API",
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// Mount modular API routers
app.use("/api/auth", authRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/guests", guestsRouter);
app.use("/api/expenses", expensesRouter);
app.use("/api/gifts", giftsRouter);
app.use("/api/template", templateRouter);

// Catch-all for undefined routes
app.use(notFoundHandler);

// Centralized error handling
app.use(errorHandler);

// Start server
const server = app.listen(config.PORT, () => {
  console.log("=================================================");
  console.log(`  Somboth API Server running on port ${config.PORT}`);
  console.log(`  Environment: ${config.NODE_ENV}`);
  console.log(`  Base URL:    http://localhost:${config.PORT}`);
  console.log(`  Health:      http://localhost:${config.PORT}/api/health`);
  console.log("=================================================");
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.log(`[API] Notice: Port ${config.PORT} is already running an active Somboth API instance.`);
  } else {
    console.error("[API] Server error:", err);
  }
});
