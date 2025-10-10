const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const captionRoutes = require("./routes/captionRoutes");

const app = express();
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5051",
  "https://doozlai.com",
  "https://www.doozlai.com",
  "https://caption.doozl.com",
  "http://caption.doozl.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));

app.get("/", (req, res) => {
  res.send("CaptionIt API is running 🚀");
});

// routes
app.use("/api", captionRoutes);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
