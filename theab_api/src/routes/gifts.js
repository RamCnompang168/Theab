const express = require("express");
const db = require("../db");
const { authenticateToken, optionalAuth } = require("../middleware/auth");

const router = express.Router();

/**
 * GET /api/gifts
 * List all wedding gift envelopes with optional filtering
 */
router.get("/", optionalAuth, (req, res, next) => {
  try {
    const { projectId = "proj-1", currency, group, thankYouSent, search } = req.query;

    let gifts = db.find("gifts", (g) => g.projectId === projectId);

    if (currency && currency !== "All") {
      gifts = gifts.filter((g) => g.currency.toUpperCase() === currency.toUpperCase());
    }

    if (group && group !== "All") {
      gifts = gifts.filter((g) => g.group.toLowerCase() === group.toLowerCase());
    }

    if (thankYouSent !== undefined && thankYouSent !== "All") {
      const isSent = thankYouSent === "true" || thankYouSent === true;
      gifts = gifts.filter((g) => Boolean(g.thankYouSent) === isSent);
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      gifts = gifts.filter(
        (g) =>
          (g.guestName && g.guestName.toLowerCase().includes(q)) ||
          (g.note && g.note.toLowerCase().includes(q)) ||
          (g.group && g.group.toLowerCase().includes(q))
      );
    }

    return res.json({
      success: true,
      count: gifts.length,
      gifts,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/gifts/summary
 * Total gifts collected in USD, KHR, and combined values
 */
router.get("/summary", optionalAuth, (req, res, next) => {
  try {
    const { projectId = "proj-1" } = req.query;

    const project = db.findById("projects", projectId);
    const exchangeRate = project ? Number(project.exchangeRateKHR) || 4000 : 4000;
    const gifts = db.find("gifts", (g) => g.projectId === projectId);

    let totalUSD = 0;
    let totalKHR = 0;
    let thankYouSentCount = 0;

    gifts.forEach((g) => {
      const amt = Number(g.amount) || 0;
      if (g.currency === "KHR") {
        totalKHR += amt;
      } else {
        totalUSD += amt;
      }
      if (g.thankYouSent) {
        thankYouSentCount += 1;
      }
    });

    const combinedTotalUSD = totalUSD + (totalKHR / exchangeRate);

    return res.json({
      success: true,
      summary: {
        envelopeCount: gifts.length,
        totalUSD,
        totalKHR,
        exchangeRate,
        combinedTotalUSD: Math.round(combinedTotalUSD * 100) / 100,
        thankYouSentCount,
        thankYouPendingCount: gifts.length - thankYouSentCount,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/gifts/export
 * Download CSV export of all gift envelopes
 */
router.get("/export", optionalAuth, (req, res, next) => {
  try {
    const { projectId = "proj-1" } = req.query;
    const project = db.findById("projects", projectId);
    const exchangeRate = project ? Number(project.exchangeRateKHR) || 4000 : 4000;
    const gifts = db.find("gifts", (g) => g.projectId === projectId);

    const headers = [
      "ID",
      "Guest Name",
      "Group",
      "Currency",
      "Amount",
      "Amount USD Equivalent",
      "Thank You Card Sent",
      "Received At",
      "Note / Wish",
    ];

    const rows = gifts.map((g) => {
      const amt = Number(g.amount) || 0;
      const usdEq = g.currency === "KHR" ? Math.round((amt / exchangeRate) * 100) / 100 : amt;
      return [
        `"${g.id}"`,
        `"${(g.guestName || "").replace(/"/g, '""')}"`,
        `"${(g.group || "").replace(/"/g, '""')}"`,
        `"${g.currency || "USD"}"`,
        amt,
        usdEq,
        g.thankYouSent ? "Yes" : "No",
        `"${(g.receivedAt || "").replace(/"/g, '""')}"`,
        `"${(g.note || "").replace(/"/g, '""')}"`,
      ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\r\n");

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="wedding-gifts-${projectId}.csv"`);
    return res.send(csvContent);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/gifts/:id
 * Get single gift envelope
 */
router.get("/:id", optionalAuth, (req, res, next) => {
  try {
    const gift = db.findById("gifts", req.params.id);
    if (!gift) {
      return res.status(404).json({
        success: false,
        error: "Gift envelope record not found.",
      });
    }

    return res.json({
      success: true,
      gift,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/gifts
 * Add a new gift envelope record
 */
router.post("/", authenticateToken, (req, res, next) => {
  try {
    const {
      projectId = "proj-1",
      guestName,
      group = "Family",
      currency = "USD",
      amount = 0,
      note = "",
      thankYouSent = false,
      receivedAt = "Just now",
    } = req.body;

    if (!guestName || !guestName.trim()) {
      return res.status(400).json({
        success: false,
        error: "Guest name is required.",
      });
    }

    const cleanCurrency = currency.toUpperCase() === "KHR" ? "KHR" : "USD";
    const cleanAmount = Number(amount) || 0;

    const project = db.findById("projects", projectId);
    const exchangeRate = project ? Number(project.exchangeRateKHR) || 4000 : 4000;
    const amountUSD = cleanCurrency === "KHR" ? Math.round((cleanAmount / exchangeRate) * 100) / 100 : cleanAmount;

    const newGift = db.insert("gifts", {
      projectId,
      guestName: guestName.trim(),
      group: group.trim(),
      currency: cleanCurrency,
      amount: cleanAmount,
      amountUSD,
      note: note ? note.trim() : "",
      thankYouSent: Boolean(thankYouSent),
      receivedAt: receivedAt || "Just now",
    });

    return res.status(201).json({
      success: true,
      message: "Wedding gift envelope recorded successfully.",
      gift: newGift,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/gifts/:id/thank-you
 * Toggle thank you card status
 */
router.patch("/:id/thank-you", authenticateToken, (req, res, next) => {
  try {
    const existing = db.findById("gifts", req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: "Gift envelope not found.",
      });
    }

    const newStatus = req.body.thankYouSent !== undefined ? Boolean(req.body.thankYouSent) : !existing.thankYouSent;
    const updated = db.updateById("gifts", req.params.id, { thankYouSent: newStatus });

    return res.json({
      success: true,
      message: newStatus ? "Thank you card marked as sent." : "Thank you card marked as pending.",
      gift: updated,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/gifts/:id
 * Update gift envelope details
 */
router.put("/:id", authenticateToken, (req, res, next) => {
  try {
    const existing = db.findById("gifts", req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: "Gift envelope not found.",
      });
    }

    const { guestName, group, currency, amount, note, thankYouSent, receivedAt } = req.body;
    const updates = {};

    if (guestName !== undefined) updates.guestName = guestName.trim();
    if (group !== undefined) updates.group = group.trim();
    if (currency !== undefined) updates.currency = currency.toUpperCase() === "KHR" ? "KHR" : "USD";
    if (amount !== undefined) updates.amount = Number(amount);
    if (note !== undefined) updates.note = note.trim();
    if (thankYouSent !== undefined) updates.thankYouSent = Boolean(thankYouSent);
    if (receivedAt !== undefined) updates.receivedAt = receivedAt;

    // Recalculate amountUSD if amount or currency changed
    const curr = updates.currency || existing.currency;
    const amt = updates.amount !== undefined ? updates.amount : existing.amount;
    const project = db.findById("projects", existing.projectId);
    const exchangeRate = project ? Number(project.exchangeRateKHR) || 4000 : 4000;
    updates.amountUSD = curr === "KHR" ? Math.round((amt / exchangeRate) * 100) / 100 : amt;

    const updated = db.updateById("gifts", req.params.id, updates);

    return res.json({
      success: true,
      message: "Gift envelope updated successfully.",
      gift: updated,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/gifts/:id
 * Delete gift envelope
 */
router.delete("/:id", authenticateToken, (req, res, next) => {
  try {
    const deleted = db.deleteById("gifts", req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: "Gift envelope not found.",
      });
    }

    return res.json({
      success: true,
      message: "Gift envelope deleted successfully.",
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
