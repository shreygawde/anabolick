const express = require("express");
const router = express.Router();

const callOpenAI = require("../services/openaiService");

router.post("/", async (req, res) => {
  try {
    const userText = req.body.text;

    if (!userText || typeof userText !== "string") {
      return res.status(400).json({
        error: "Text is required"
      });
    }

    const aiResult = await callOpenAI(userText);

    res.json(aiResult);

  } catch (err) {
    console.error(err.response?.data || err.message);

    const status = err.response?.status || 500;

    res.status(status).json({
      error: err.response?.data?.error?.message || err.message || "Server error"
    });
  }
});

module.exports = router;