const express = require("express");
const router = express.Router();
const { generateCaptionHandler } = require("../controllers/captionController");

// POST /api/generate-caption
router.post("/generate-caption", generateCaptionHandler);

module.exports = router;
