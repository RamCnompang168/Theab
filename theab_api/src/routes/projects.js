const express = require("express");
const db = require("../db");
const { authenticateToken, optionalAuth } = require("../middleware/auth");

const router = express.Router();

/**
 * GET /api/projects
 * List all projects for authenticated user
 */
router.get("/", authenticateToken, (req, res, next) => {
  try {
    const projects = db.find("projects", (p) => p.userId === req.user.id);
    return res.json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/projects/:id
 * Get single project by ID
 */
router.get("/:id", optionalAuth, (req, res, next) => {
  try {
    const project = db.findById("projects", req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: "Wedding project not found.",
      });
    }

    return res.json({
      success: true,
      project,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/projects/:id/dashboard
 * Aggregated dashboard metrics for a project
 */
router.get("/:id/dashboard", optionalAuth, (req, res, next) => {
  try {
    const project = db.findById("projects", req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: "Wedding project not found.",
      });
    }

    const guests = db.find("guests", (g) => g.projectId === req.params.id);
    const expenses = db.find("expenses", (e) => e.projectId === req.params.id);
    const gifts = db.find("gifts", (g) => g.projectId === req.params.id);

    // Guest analytics
    const totalGuests = guests.length;
    const confirmedGuests = guests.filter((g) => g.status === "Confirmed").length;
    const pendingGuests = guests.filter((g) => g.status === "Pending").length;
    const declinedGuests = guests.filter((g) => g.status === "Declined").length;

    // Expense analytics
    const totalBudgetUSD = Number(project.totalBudgetUSD) || 10000;
    const totalActualExpenseUSD = expenses.reduce((sum, item) => sum + (Number(item.actualAmount) || 0), 0);
    const totalBudgetedExpenses = expenses.reduce((sum, item) => sum + (Number(item.budgetAmount) || 0), 0);
    const remainingBudgetUSD = totalBudgetUSD - totalActualExpenseUSD;

    // Gift envelope analytics
    const exchangeRate = Number(project.exchangeRateKHR) || 4000;
    let totalGiftUSD = 0;
    let totalGiftKHR = 0;
    let thankYouSentCount = 0;

    gifts.forEach((gift) => {
      if (gift.currency === "KHR") {
        totalGiftKHR += Number(gift.amount) || 0;
      } else {
        totalGiftUSD += Number(gift.amount) || 0;
      }
      if (gift.thankYouSent) {
        thankYouSentCount += 1;
      }
    });

    const totalGiftCombinedUSD = totalGiftUSD + (totalGiftKHR / exchangeRate);

    return res.json({
      success: true,
      dashboard: {
        project,
        guests: {
          total: totalGuests,
          goal: Number(project.totalGuestsGoal) || 200,
          confirmed: confirmedGuests,
          pending: pendingGuests,
          declined: declinedGuests,
          confirmationRate: totalGuests > 0 ? Math.round((confirmedGuests / totalGuests) * 100) : 0,
        },
        expenses: {
          totalBudgetUSD,
          totalBudgetedExpenses,
          totalActualExpenseUSD,
          remainingBudgetUSD,
          percentUsed: totalBudgetUSD > 0 ? Math.round((totalActualExpenseUSD / totalBudgetUSD) * 100) : 0,
          itemCount: expenses.length,
        },
        gifts: {
          envelopeCount: gifts.length,
          totalUSD: totalGiftUSD,
          totalKHR: totalGiftKHR,
          combinedTotalUSD: Math.round(totalGiftCombinedUSD * 100) / 100,
          thankYouSentCount,
          thankYouPendingCount: gifts.length - thankYouSentCount,
        },
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/projects
 * Create a new wedding project
 */
router.post("/", authenticateToken, (req, res, next) => {
  try {
    const {
      title,
      groomName,
      brideName,
      date,
      time,
      venue,
      city,
      totalGuestsGoal,
      totalBudgetUSD,
      exchangeRateKHR,
    } = req.body;

    if (!title || !groomName || !brideName || !date || !venue) {
      return res.status(400).json({
        success: false,
        error: "Title, Groom's Name, Bride's Name, Date, and Venue are required.",
      });
    }

    const newProject = db.insert("projects", {
      userId: req.user.id,
      title: title.trim(),
      groomName: groomName.trim(),
      brideName: brideName.trim(),
      date,
      time: time || "17:30",
      venue: venue.trim(),
      city: city ? city.trim() : "Phnom Penh, Cambodia",
      totalGuestsGoal: Number(totalGuestsGoal) || 200,
      totalBudgetUSD: Number(totalBudgetUSD) || 10000,
      exchangeRateKHR: Number(exchangeRateKHR) || 4000,
    });

    // Auto-create initial digital invitation template for this project
    const existingTemplate = db.findOne("templates", (t) => t.projectId === newProject.id);
    if (!existingTemplate) {
      db.insert("templates", {
        projectId: newProject.id,
        selectedTemplate: "រចនាបថរាជសីមាស (W01)",
        coverText: "សូមគោរពអញ្ជើញ",
        topColor: "#FBE0B6",
        bottomColor: "#E9A96E",
        shadowColor: "#7A4A2E",
        shadowSpread: 4,
        buttonColor: "#705D48",
        textColor: "#C6BA7B",
        titleTextShadow: true,
        coverImage: "/sample-template.png",
        backgroundImage: "/traditional-pattern.jpg",
        mainTitle: `ពិធីមង្គលការ ${newProject.groomName} និង ${newProject.brideName}`,
        groomName: newProject.groomName,
        brideName: newProject.brideName,
        isGroomFirst: true,
        subtitle: "សូមអញ្ជើញចូលរួមអបអរសាទរថ្ងៃដ៏ពិសេសរបស់យើង",
        dateTime: `${newProject.date} at ${newProject.time || "5:00 PM"}`,
        venueLocation: `${newProject.venue}, ${newProject.city}`,
        messageTitle: "លិខិតអញ្ជើញចូលរួមពិធីមង្គលការ",
        invitationMessage:
          "យើងខ្ញុំ និងក្រុមគ្រួសារ សូមគោរពអញ្ជើញលោកអ្នកចូលរួមជាភ្ញៀវកិត្តិយសក្នុងពិធីមង្គលការរបស់យើងខ្ញុំ។ វត្តមាន និងពរជ័យដ៏កក់ក្តៅរបស់លោកអ្នក នឹងធ្វើឱ្យពិធីរបស់យើងខ្ញុំពេញលេញ និងមានអត្ថន័យជាទីបំផុត។",
        scheduleItems: [
          { id: "s-1", time: "07:00", title: "ពិធីដង្ហែរកូនកំលោះ និងទទួលភ្ញៀវ", desc: "ទទួលកូនកំលោះ និងជំនូនតាមប្រពៃណី" },
          { id: "s-2", time: "09:30", title: "ពិធីចងដៃ និងបំពាក់ចិញ្ចៀន", desc: "សច្ចាប្រណិធាន និងពរជ័យពីចាស់ទុំ" },
          { id: "s-3", time: "17:00", title: "ទទួលភ្ញៀវពេលល្ងាច", desc: "ថតរូបអនុស្សាវរីយ៍ និងទទួលភ្ញៀវ" },
          { id: "s-4", time: "18:30", title: "ពិធីជប់លៀង និងកាត់នំ", desc: "ទទួលទានអាហារ សុន្ទរកថា និងកាត់នំ" },
          { id: "s-5", time: "20:30", title: "តន្ត្រី និងរាំលេងកម្សាន្ត", desc: "រីករាយជាមួយតន្ត្រី និងរាំជុំគ្នា" },
        ],
        googleMapsUrl: "https://maps.app.goo.gl/9Wh42r1JEXaL6PXJ9",
        designMapImage: "/design-map.svg",
        galleryPhotos: [
          "/sample-template.png",
          "/groom-portrait.png",
          "/sample-template.png",
          "/groom-portrait.png",
        ],
        gratitudeTitle: "ដោយក្តីសោមនស្ស និងអំណរគុណ",
        gratitudeMessage:
          "យើងខ្ញុំសូមថ្លែងអំណរគុណយ៉ាងជ្រាលជ្រៅចំពោះមាតាបិតា ភ្ញៀវកិត្តិយស ក្រុមគ្រួសារ និងមិត្តភក្តិទាំងអស់ ដែលបានចំណាយពេលវេលាដ៏មានតម្លៃមកចូលរួមអបអរសាទរ។ សូមប្រកបដោយសេចក្តីសុខ សុភមង្គល និងជោគជ័យគ្រប់ប្រការ។",
        khqrUsdImage: "/khqr-usd.svg",
        khqrKhrImage: "/khqr-khr.svg",
        bankAccountName: `${newProject.groomName.toUpperCase()} & ${newProject.brideName.toUpperCase()}`,
        bankName: "ABA Bank",
        selectedMusic: "Royal Classical Wedding Melody",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Wedding project created successfully.",
      project: newProject,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/projects/:id
 * Update project details
 */
router.put("/:id", authenticateToken, (req, res, next) => {
  try {
    const existing = db.findById("projects", req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: "Wedding project not found.",
      });
    }

    const {
      title,
      groomName,
      brideName,
      date,
      time,
      venue,
      city,
      totalGuestsGoal,
      totalBudgetUSD,
      exchangeRateKHR,
    } = req.body;

    const updates = {};
    if (title !== undefined) updates.title = title.trim();
    if (groomName !== undefined) updates.groomName = groomName.trim();
    if (brideName !== undefined) updates.brideName = brideName.trim();
    if (date !== undefined) updates.date = date;
    if (time !== undefined) updates.time = time;
    if (venue !== undefined) updates.venue = venue.trim();
    if (city !== undefined) updates.city = city.trim();
    if (totalGuestsGoal !== undefined) updates.totalGuestsGoal = Number(totalGuestsGoal);
    if (totalBudgetUSD !== undefined) updates.totalBudgetUSD = Number(totalBudgetUSD);
    if (exchangeRateKHR !== undefined) updates.exchangeRateKHR = Number(exchangeRateKHR);

    const updated = db.updateById("projects", req.params.id, updates);

    return res.json({
      success: true,
      message: "Project updated successfully.",
      project: updated,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/projects/:id
 * Delete project and associated records
 */
router.delete("/:id", authenticateToken, (req, res, next) => {
  try {
    const projectId = req.params.id;
    const existing = db.findById("projects", projectId);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: "Wedding project not found.",
      });
    }

    db.deleteById("projects", projectId);

    // Clean up associated resources
    const guests = db.find("guests", (g) => g.projectId === projectId);
    guests.forEach((g) => db.deleteById("guests", g.id));

    const expenses = db.find("expenses", (e) => e.projectId === projectId);
    expenses.forEach((e) => db.deleteById("expenses", e.id));

    const gifts = db.find("gifts", (g) => g.projectId === projectId);
    gifts.forEach((g) => db.deleteById("gifts", g.id));

    const templates = db.find("templates", (t) => t.projectId === projectId);
    templates.forEach((t) => db.deleteById("templates", t.id));

    return res.json({
      success: true,
      message: "Wedding project and all associated records deleted successfully.",
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
