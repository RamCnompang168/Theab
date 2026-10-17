require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  JWT_SECRET: process.env.JWT_SECRET || "somboth_secret_key_luxury_event_management_2026",
  JWT_EXPIRES_IN: "7d",
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
};
