const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const captionRoutes = require("./routes/captionRoutes");

const app = express();

const defaultAllowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5051",
  "https://doozlai.com",
  "https://www.doozlai.com",
  "https://caption.doozlai.com",
  "http://caption.doozlai.com",
];

// Allow additional origins via env (comma-separated), e.g.
// CORS_ORIGINS="https://captionit-frontend.onrender.com,https://app.example.com"
const envAllowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const allowedOrigins = Array.from(
  new Set([...defaultAllowedOrigins, ...envAllowedOrigins])
);

// Also allow well-known patterns for subdomains when deployed
const allowedOriginPatterns = [
  /^https?:\/\/localhost(:\d+)?$/i,
  /^https?:\/\/([a-z0-9-]+\.)*doozlai\.com$/i,
  /^https?:\/\/([a-z0-9-]+\.)*onrender\.com$/i,
];

function isOriginAllowed(origin) {
  const normalizedOrigin = origin.replace(/\/$/, "");
  const inExplicitList = allowedOrigins.some((allowed) =>
    normalizedOrigin.startsWith(allowed)
  );
  const matchesPattern = allowedOriginPatterns.some((re) =>
    re.test(normalizedOrigin)
  );
  return inExplicitList || matchesPattern;
}

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like curl or Postman)
    if (!origin) return callback(null, true);

    if (isOriginAllowed(origin)) {
      callback(null, true);
    } else {
      console.warn(`❌ Blocked by CORS: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
// Express 5 no longer accepts bare '*' patterns in route paths; rely on global CORS
// and explicitly handle OPTIONS by returning 204 for any path.
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json({ limit: "10mb" }));

app.get("/", (req, res) => {
  res.send("CaptionIt API is running 🚀");
});

// routes
app.use("/api", captionRoutes);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
