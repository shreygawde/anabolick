require("dotenv").config();

const express = require("express");
const cors = require("cors");

/*const analyzeRoute = require("./routes/analyzeRoute");
const summaryRoute = require("./routes/summaryRoute");
const weeklyRoute = require("./routes/weeklyRoute");
const userRoute = require("./routes/userRoute");
*/
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API running");
});

/*app.use("/analyze-text", analyzeRoute);
app.use("/summary", summaryRoute);
app.use("/weekly", weeklyRoute);
app.use("/user", userRoute);
*/
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});