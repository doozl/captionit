const { generateCaptions } = require("../services/aiService");

async function generateCaptionHandler(req, res) {
  try {
    const { imageUrl, imageBase64, imageDescription } = req.body;

    const data = await generateCaptions({
      imageUrl,
      imageBase64,
      imageDescription,
      numVibes: 3,
      captionsPerVibe: 5,
    });

    res.json({ success: true, data });
  } catch (err) {
    console.error("Error generating captions:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Failed to generate captions",
    });
  }
}

module.exports = { generateCaptionHandler };
