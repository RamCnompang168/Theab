const express = require("express");
const db = require("../db");
const { authenticateToken, optionalAuth } = require("../middleware/auth");

const router = express.Router();

/**
 * GET /api/expenses
 * List all expenses for a project with optional filters
 */
router.get("/", optionalAuth, (req, res, next) => {
  try {
    const { projectId = "proj-1", category, status } = req.query;

    let expenses = db.find("expenses", (e) => e.projectId === projectId);

    if (category && category !== "All") {
      expenses = expenses.filter((e) => e.category.toLowerCase() === category.toLowerCase());
    }

    if (status && status !== "All") {
      expenses = expenses.filter((e) => e.status.toLowerCase() === status.toLowerCase());
    }

    return res.json({
      success: true,
      count: expenses.length,
      expenses,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/expenses/summary
 * Budget vs Actual expenditure metrics and category breakdowns
 */
router.get("/summary", optionalAuth, (req, res, next) => {
  try {
    const { projectId = "proj-1" } = req.query;

    const project = db.findById("projects", projectId);
    const expenses = db.find("expenses", (e) => e.projectId === projectId);

    const totalProjectBudgetUSD = project ? Number(project.totalBudgetUSD) || 10000 : 10000;
    const totalActual = expenses.reduce((sum, item) => sum + (Number(item.actualAmount) || 0), 0);
    const totalBudgeted = expenses.reduce((sum, item) => sum + (Number(item.budgetAmount) || 0), 0);
    const remaining = totalProjectBudgetUSD - totalActual;

    // Group by category
    const categoryMap = {};
    expenses.forEach((item) => {
      const cat = item.category || "General";
      if (!categoryMap[cat]) {
        categoryMap[cat] = { category: cat, budget: 0, actual: 0, count: 0 };
      }
      categoryMap[cat].budget += Number(item.budgetAmount) || 0;
      categoryMap[cat].actual += Number(item.actualAmount) || 0;
      categoryMap[cat].count += 1;
    });

    const categoryBreakdown = Object.values(categoryMap);

    // Group by payment status
    const paidTotal = expenses.filter((e) => e.status === "Paid").reduce((s, e) => s + (Number(e.actualAmount) || 0), 0);
    const depositTotal = expenses.filter((e) => e.status === "Deposit").reduce((s, e) => s + (Number(e.actualAmount) || 0), 0);
    const pendingTotal = expenses.filter((e) => e.status === "Pending").reduce((s, e) => s + (Number(e.actualAmount) || 0), 0);

    return res.json({
      success: true,
      summary: {
        totalProjectBudgetUSD,
        totalBudgeted,
        totalActual,
        remaining,
        percentUsed: totalProjectBudgetUSD > 0 ? Math.round((totalActual / totalProjectBudgetUSD) * 100) : 0,
        categoryBreakdown,
        statusBreakdown: {
          paid: paidTotal,
          deposit: depositTotal,
          pending: pendingTotal,
        },
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/expenses/:id
 * Get single expense item
 */
router.get("/:id", optionalAuth, (req, res, next) => {
  try {
    const expense = db.findById("expenses", req.params.id);
    if (!expense) {
      return res.status(404).json({
        success: false,
        error: "Expense item not found.",
      });
    }

    return res.json({
      success: true,
      expense,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/expenses
 * Add new expense
 */
router.post("/", authenticateToken, (req, res, next) => {
  try {
    const {
      projectId = "proj-1",
      name,
      category = "General",
      budgetAmount = 0,
      actualAmount = 0,
      status = "Pending",
      description = "",
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        error: "Expense item name is required.",
      });
    }

    const newExpense = db.insert("expenses", {
      projectId,
      name: name.trim(),
      category: category.trim(),
      budgetAmount: Number(budgetAmount) || 0,
      actualAmount: Number(actualAmount) || 0,
      status: ["Paid", "Deposit", "Pending"].includes(status) ? status : "Pending",
      description: description ? description.trim() : "",
    });

    return res.status(201).json({
      success: true,
      message: "Expense item recorded successfully.",
      expense: newExpense,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/expenses/:id
 * Update expense item
 */
router.put("/:id", authenticateToken, (req, res, next) => {
  try {
    const existing = db.findById("expenses", req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: "Expense item not found.",
      });
    }

    const { name, category, budgetAmount, actualAmount, status, description } = req.body;
    const updates = {};

    if (name !== undefined) updates.name = name.trim();
    if (category !== undefined) updates.category = category.trim();
    if (budgetAmount !== undefined) updates.budgetAmount = Number(budgetAmount);
    if (actualAmount !== undefined) updates.actualAmount = Number(actualAmount);
    if (status !== undefined) updates.status = status;
    if (description !== undefined) updates.description = description.trim();

    const updated = db.updateById("expenses", req.params.id, updates);

    return res.json({
      success: true,
      message: "Expense item updated successfully.",
      expense: updated,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/expenses/:id
 * Delete expense item
 */
router.delete("/:id", authenticateToken, (req, res, next) => {
  try {
    const deleted = db.deleteById("expenses", req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: "Expense item not found.",
      });
    }

    return res.json({
      success: true,
      message: "Expense item deleted successfully.",
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
