const express = require("express");
const router = express.Router();

const analyzeMeal = require("../services/nutritionService");

router.post("/", async (req, res) => {
  try {

    const userText = req.body.text;

    if (!userText || typeof userText !== "string") {
      return res.status(400).json({
        error: "Text is required"
      });
    }

    const result = await analyzeMeal(userText);

    res.json(result);

  } catch (err) {

    console.error(err.response?.data || err.message);

    const status = err.response?.status || 500;

    res.status(status).json({
      error: err.response?.data?.error?.message || err.message || "Server error"
    });

  }
});

module.exports = router;