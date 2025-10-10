// server/index.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const captionRoutes = require("./routes/captionRoutes");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" })); // supports base64 image uploads

app.get("/", (req, res) => {
  res.send("CaptionIt API is running 🚀");
});

// routes
app.use("/api", captionRoutes);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
