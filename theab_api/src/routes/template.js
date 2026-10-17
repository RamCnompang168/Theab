const express = require("express");
const db = require("../db");
const { authenticateToken, optionalAuth } = require("../middleware/auth");

const router = express.Router();

/**
 * Helper to produce default template object
 */
function createDefaultTemplate(projectId, project) {
  const groom = project ? project.groomName : "Visal Sok";
  const bride = project ? project.brideName : "Sophea Chan";
  const venue = project ? `${project.venue}, ${project.city}` : "The Premier Centre Sen Sok (Building C), Phnom Penh";
  const dateTime = project ? `${project.date} at ${project.time || "5:00 PM"}` : "Saturday, 28 November 2026 at 5:00 PM";

  return {
    projectId,
    selectedTemplate: "Royal Gold Theme (W01)",
    coverText: "You Are Cordially Invited",
    topColor: "#FBE0B6",
    bottomColor: "#E9A96E",
    shadowColor: "#7A4A2E",
    shadowSpread: 4,
    buttonColor: "#705D48",
    textColor: "#C6BA7B",
    titleTextShadow: true,
    coverImage: "/sample-template.png",
    backgroundImage: "/traditional-pattern.jpg",
    mainTitle: `${groom} & ${bride} Grand Wedding Celebration`,
    groomName: groom,
    brideName: bride,
    isGroomFirst: true,
    subtitle: "Cordially Invite You to Celebrate Our Special Day",
    dateTime,
    venueLocation: venue,
    messageTitle: "Our Wedding Invitation",
    invitationMessage:
      "Together with our parents and families, we warmly invite you to join us as our honored guest in celebrating our wedding ceremony and reception banquet. Your presence and warm blessings will make our celebration truly complete.",
    scheduleItems: [
      { id: "s-1", time: "07:00 AM", title: "Groom Procession & Traditional Welcoming", desc: "Arrival of the groom, fruit tray gifts, and family blessings" },
      { id: "s-2", time: "09:30 AM", title: "Ring Exchange & Tea Ceremony", desc: "Sacred marriage pledge and blessing by elder parents" },
      { id: "s-3", time: "05:00 PM", title: "Evening Reception & Welcome Cocktails", desc: "Guest arrivals, photo booth memories, and seating" },
      { id: "s-4", time: "06:30 PM", title: "Grand Wedding Banquet & Cake Cutting", desc: "Multi-course dinner service, couple grand entrance and toast" },
      { id: "s-5", time: "08:30 PM", title: "Live Music & Dance Celebration", desc: "Live wedding orchestra, dance floor opening, and celebration" },
    ],
    googleMapsUrl: "https://maps.app.goo.gl/9Wh42r1JEXaL6PXJ9",
    designMapImage: "/design-map.svg",
    galleryPhotos: [
      "/sample-template.png",
      "/groom-portrait.png",
      "/sample-template.png",
      "/groom-portrait.png",
    ],
    gratitudeTitle: "With Sincere Gratitude & Thanks",
    gratitudeMessage:
      "We express our deepest appreciation and heartfelt gratitude to our beloved parents, esteemed guests, family members, and friends who traveled from near and far to celebrate this monumental day with us. May joy, peace, and prosperity be with you always.",
    khqrUsdImage: "/khqr-usd.svg",
    khqrKhrImage: "/khqr-khr.svg",
    bankAccountName: `${groom.toUpperCase()} & ${bride.toUpperCase()}`,
    bankName: "ABA Bank",
    selectedMusic: "Royal Classical Wedding Melody",
  };
}

/**
 * GET /api/template/:projectId
 * Get digital invitation template configuration
 */
router.get("/:projectId", optionalAuth, (req, res, next) => {
  try {
    const { projectId } = req.params;
    let template = db.findOne("templates", (t) => t.projectId === projectId);

    if (!template) {
      const project = db.findById("projects", projectId);
      const defaultData = createDefaultTemplate(projectId, project);
      template = db.insert("templates", defaultData);
    }

    return res.json({
      success: true,
      template,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/template/:projectId
 * Update or create digital invitation template configuration
 */
router.put("/:projectId", authenticateToken, (req, res, next) => {
  try {
    const { projectId } = req.params;
    let template = db.findOne("templates", (t) => t.projectId === projectId);

    if (!template) {
      const project = db.findById("projects", projectId);
      const defaultData = createDefaultTemplate(projectId, project);
      template = db.insert("templates", {
        ...defaultData,
        ...req.body,
        projectId,
      });
    } else {
      template = db.updateById("templates", template.id, {
        ...req.body,
        projectId,
      });
    }

    return res.json({
      success: true,
      message: "Digital invitation template saved successfully.",
      template,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/template/public/:projectId
 * Public read-only digital invitation for wedding guests
 */
router.get("/public/:projectId", (req, res, next) => {
  try {
    const { projectId } = req.params;
    let template = db.findOne("templates", (t) => t.projectId === projectId);

    if (!template) {
      const project = db.findById("projects", projectId);
      if (!project) {
        return res.status(404).json({
          success: false,
          error: "Wedding celebration invitation not found.",
        });
      }
      template = createDefaultTemplate(projectId, project);
    }

    const project = db.findById("projects", projectId);

    return res.json({
      success: true,
      invitation: {
        ...template,
        couple: project ? { groom: project.groomName, bride: project.brideName } : null,
        weddingDate: project ? project.date : null,
        venue: project ? project.venue : null,
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
