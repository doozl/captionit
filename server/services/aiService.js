const OpenAI = require("openai");
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const DEFAULT_VIBES = ["trendy", "emotional", "funny", "travel", "romantic"];

const VIBE_META = {
  trendy: { emoji: "✨", title: "Trendy / GenZ" },
  emotional: { emoji: "💭", title: "Emotional / Deep Thought" },
  funny: { emoji: "😂", title: "Funny / Meme-style" },
  travel: { emoji: "🌍", title: "Travel / Adventure" },
  romantic: { emoji: "❤️", title: "Romantic / Couple pic" },
};

/**
 * generateCaptions
 * @param {Object} opts
 * @param {string} [opts.imageUrl] - public image URL (preferred)
 * @param {string} [opts.imageBase64] - base64 image payload (no data: prefix)
 * @param {string} [opts.imageDescription] - short fallback description (if image not provided)
 * @param {number} [opts.numVibes=3] - how many top vibes to identify (<= DEFAULT_VIBES.length)
 * @param {number} [opts.captionsPerVibe=5]
 */
async function generateCaptions({
  imageUrl,
  imageBase64,
  imageDescription,
  numVibes = 3,
  captionsPerVibe = 5,
}) {
  if (!imageUrl && !imageBase64 && !imageDescription) {
    throw new Error("Provide imageUrl, imageBase64, or imageDescription");
  }

  // JSON Schema to force structured JSON output from the model
  const schema = {
    type: "object",
    properties: {
      primary_vibe: { type: "string", enum: DEFAULT_VIBES },
      vibes: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string", enum: DEFAULT_VIBES },
            emoji: { type: "string" },
            title: { type: "string" },
            captions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "integer" },
                  text: { type: "string" },
                },
                required: ["id", "text"],
              },
            },
          },
          required: ["id", "emoji", "title", "captions"],
        },
      },
    },
    required: ["primary_vibe", "vibes"],
  };

  // Instruction prompt: short & strict so model returns only the JSON we expect.
  const instruction = `
Analyze the provided image and identify up to ${numVibes} vibes from this set: ${DEFAULT_VIBES.join(
    ", "
  )}.
For each vibe you pick, generate ${captionsPerVibe} short, social-media-ready captions (each one short, emoji-allowed, casual tone).
Return ONLY a JSON object matching the schema provided to the API (no extra commentary).
`;

  // Build the multimodal input content array
  const userContent = [{ type: "input_text", text: instruction.trim() }];

  if (imageBase64) {
    // If the caller passes base64, we send inline data URL (remember to include mime type if you have it)
    // The frontend/backend upload flow should detect mime type (e.g., image/jpeg) — we default to image/jpeg
    const dataUrl = `data:image/jpeg;base64,${imageBase64}`;
    userContent.push({ type: "input_image", image_url: dataUrl });
  } else if (imageUrl) {
    userContent.push({ type: "input_image", image_url: imageUrl });
  } else if (imageDescription) {
    // no image; provide description text only
    userContent.push({
      type: "input_text",
      text: `Image description: ${imageDescription}`,
    });
  }

  try {
    const resp = await client.responses.create({
      model: "gpt-4o-mini",
      input: [{ role: "user", content: userContent }],
      text: {
        format: { type: "json_object" },
      },
      max_output_tokens: 800,
    });

    // Many SDKs return a helpful combined text version at `output_text`
    const raw = resp.output_text ?? null;

    if (!raw) {
      // Last-resort: stitch text from outputs
      const stitched = (resp.output || [])
        .map((o) =>
          (o.content || []).map((c) => (c.text ? c.text : "")).join("")
        )
        .join("\n");
      if (!stitched) throw new Error("No output returned from model");
      return JSON.parse(stitched);
    }

    const parsed = JSON.parse(raw);

    // Normalize/ensure emojis/titles present for our known vibes
    parsed.vibes = parsed.vibes.map((v) => {
      const id = v.id?.toLowerCase();
      return {
        id,
        emoji: v.emoji ?? (VIBE_META[id] && VIBE_META[id].emoji) ?? "✨",
        title: v.title ?? (VIBE_META[id] && VIBE_META[id].title) ?? id,
        captions: Array.isArray(v.captions)
          ? v.captions.map((c, i) =>
              typeof c === "object" && c.text
                ? { id: i + 1, text: c.text }
                : { id: i + 1, text: String(c) }
            )
          : [],
      };
    });

    return parsed;
  } catch (err) {
    // Helpful error surface for debugging
    console.error("OpenAI responses error:", err?.message || err);
    throw err;
  }
}

module.exports = { generateCaptions };
