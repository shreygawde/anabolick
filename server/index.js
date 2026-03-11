require("dotenv").config();

const express = require("express");
const cors = require("cors");

const analyzeRoute = require("./routes/analyzeRoute");

const app = express();

// important when running behind nginx
app.set("trust proxy", true);

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Anabolick API running");
});
app.use("/analyze-text", analyzeRoute);

const PORT = process.env.PORT || 5000;

// bind to all interfaces
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});