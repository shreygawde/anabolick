require("dotenv").config();

const express = require("express");
const cors = require("cors");

const analyzeRoute = require("./routes/analyzeRoute");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/analyze-text", analyzeRoute);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});