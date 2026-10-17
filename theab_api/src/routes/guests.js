const express = require("express");
const db = require("../db");
const { authenticateToken, optionalAuth } = require("../middleware/auth");

const router = express.Router();

/**
 * GET /api/guests
 * List guests with optional search and filters
 */
router.get("/", optionalAuth, (req, res, next) => {
  try {
    const { projectId = "proj-1", status, group, search } = req.query;

    let guests = db.find("guests", (g) => g.projectId === projectId);

    if (status && status !== "All") {
      guests = guests.filter((g) => g.status.toLowerCase() === status.toLowerCase());
    }

    if (group && group !== "All") {
      guests = guests.filter((g) => g.group.toLowerCase() === group.toLowerCase());
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      guests = guests.filter(
        (g) =>
          (g.name && g.name.toLowerCase().includes(q)) ||
          (g.nickname && g.nickname.toLowerCase().includes(q)) ||
          (g.note && g.note.toLowerCase().includes(q)) ||
          (g.tableNo && g.tableNo.toLowerCase().includes(q)) ||
          (g.wish && g.wish.toLowerCase().includes(q))
      );
    }

    return res.json({
      success: true,
      count: guests.length,
      guests,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/guests/stats
 * Statistics on guest RSVPs
 */
router.get("/stats", optionalAuth, (req, res, next) => {
  try {
    const { projectId = "proj-1" } = req.query;
    const guests = db.find("guests", (g) => g.projectId === projectId);

    const total = guests.length;
    const confirmed = guests.filter((g) => g.status === "Confirmed").length;
    const pending = guests.filter((g) => g.status === "Pending").length;
    const declined = guests.filter((g) => g.status === "Declined").length;

    return res.json({
      success: true,
      stats: {
        total,
        confirmed,
        pending,
        declined,
        confirmationRate: total > 0 ? Math.round((confirmed / total) * 100) : 0,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/guests/:id
 * Get single guest
 */
router.get("/:id", optionalAuth, (req, res, next) => {
  try {
    const guest = db.findById("guests", req.params.id);
    if (!guest) {
      return res.status(404).json({
        success: false,
        error: "Guest not found in invitation list.",
      });
    }

    return res.json({
      success: true,
      guest,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/guests
 * Add new guest to the directory
 */
router.post("/", authenticateToken, (req, res, next) => {
  try {
    const {
      projectId = "proj-1",
      name,
      nickname,
      group = "Family",
      tags = [],
      status = "Pending",
      wish = "",
      note = "",
      tableNo = "Table 01",
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        error: "Guest name is required.",
      });
    }

    const newGuest = db.insert("guests", {
      projectId,
      name: name.trim(),
      nickname: nickname ? nickname.trim() : "",
      group: group.trim(),
      tags: Array.isArray(tags) ? tags : [group.trim()],
      status: ["Confirmed", "Pending", "Declined"].includes(status) ? status : "Pending",
      wish: wish ? wish.trim() : "",
      note: note ? note.trim() : "",
      tableNo: tableNo ? tableNo.trim() : "Table 01",
    });

    return res.status(201).json({
      success: true,
      message: "Guest added successfully.",
      guest: newGuest,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/guests/:id
 * Update guest details
 */
router.put("/:id", authenticateToken, (req, res, next) => {
  try {
    const existing = db.findById("guests", req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: "Guest not found.",
      });
    }

    const { name, nickname, group, tags, status, wish, note, tableNo } = req.body;
    const updates = {};

    if (name !== undefined) updates.name = name.trim();
    if (nickname !== undefined) updates.nickname = nickname.trim();
    if (group !== undefined) updates.group = group.trim();
    if (tags !== undefined) updates.tags = Array.isArray(tags) ? tags : [tags];
    if (status !== undefined) updates.status = status;
    if (wish !== undefined) updates.wish = wish.trim();
    if (note !== undefined) updates.note = note.trim();
    if (tableNo !== undefined) updates.tableNo = tableNo.trim();

    const updated = db.updateById("guests", req.params.id, updates);

    return res.json({
      success: true,
      message: "Guest updated successfully.",
      guest: updated,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/guests/:id/status
 * Quickly change RSVP status (Confirmed / Pending / Declined)
 */
router.patch("/:id/status", authenticateToken, (req, res, next) => {
  try {
    const { status } = req.body;
    if (!["Confirmed", "Pending", "Declined"].includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Invalid status value. Must be 'Confirmed', 'Pending', or 'Declined'.",
      });
    }

    const updated = db.updateById("guests", req.params.id, { status });
    if (!updated) {
      return res.status(404).json({
        success: false,
        error: "Guest not found.",
      });
    }

    return res.json({
      success: true,
      message: `Guest status updated to ${status}.`,
      guest: updated,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/guests/:id
 * Remove guest from list
 */
router.delete("/:id", authenticateToken, (req, res, next) => {
  try {
    const deleted = db.deleteById("guests", req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: "Guest not found.",
      });
    }

    return res.json({
      success: true,
      message: "Guest removed from directory successfully.",
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/guests/rsvp
 * Public RSVP endpoint for attendees through digital invitation
 */
router.post("/rsvp", (req, res, next) => {
  try {
    const {
      projectId = "proj-1",
      guestName,
      status = "Confirmed",
      wish = "",
      attendeeCount = 1,
      phone = "",
    } = req.body;

    if (!guestName || !guestName.trim()) {
      return res.status(400).json({
        success: false,
        error: "Please enter your name to confirm your RSVP.",
      });
    }

    const cleanName = guestName.trim();
    const cleanStatus = status === "Declined" ? "Declined" : "Confirmed";

    // Find if guest exists
    const existing = db.findOne(
      "guests",
      (g) => g.projectId === projectId && g.name.toLowerCase() === cleanName.toLowerCase()
    );

    let guestRecord;
    if (existing) {
      guestRecord = db.updateById("guests", existing.id, {
        status: cleanStatus,
        wish: wish ? wish.trim() : existing.wish,
        note: phone ? `Phone: ${phone}. Attending count: ${attendeeCount}` : existing.note,
      });
    } else {
      guestRecord = db.insert("guests", {
        projectId,
        name: cleanName,
        nickname: "",
        group: "Online RSVP",
        tags: ["Online RSVP"],
        status: cleanStatus,
        wish: wish ? wish.trim() : "",
        note: phone ? `Phone: ${phone}. Attending count: ${attendeeCount}` : `Attending: ${attendeeCount}`,
        tableNo: "Unassigned",
      });
    }

    return res.json({
      success: true,
      message:
        cleanStatus === "Confirmed"
          ? "Thank you! Your RSVP has been confirmed. We look forward to celebrating with you!"
          : "Thank you for letting us know. Warm wishes!",
      guest: guestRecord,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
