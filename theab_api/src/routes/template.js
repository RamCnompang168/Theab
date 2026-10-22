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
    mainTitle: `ពិធីមង្គលការ ${groom} និង ${bride}`,
    groomName: groom,
    brideName: bride,
    isGroomFirst: true,
    subtitle: "សូមអញ្ជើញចូលរួមអបអរសាទរថ្ងៃដ៏ពិសេសរបស់យើង",
    dateTime,
    venueLocation: venue,
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
