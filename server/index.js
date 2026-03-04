require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

async function callOpenAI(text) {
  const response = await axios.post(
    "https://api.openai.com/v1/responses",
    {
      model: "gpt-4.1-mini",
      input: `
Extract food ingredients and estimated grams.
Also estimate total calories and total protein.

Return ONLY valid JSON in this format:
{
  "dishName": "",
  "ingredients": [
    { "name": "", "grams": 0 }
  ],
  "totalCalories": 0,
  "totalProtein": 0
}
Meal: ${text}
`
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  const rawText = response.data.output[0].content[0].text;

  // Extract JSON safely
  const match = rawText.match(/\{[\s\S]*\}/);

  if (!match) {
    throw new Error("No JSON found in AI response");
  }

  try {
    return JSON.parse(match[0]);
  } catch (parseError) {
    throw new Error("Invalid JSON returned by AI");
  }
}

app.post("/analyze-text", async (req, res) => {
  try {
    const userText = req.body.text;

    // Input validation
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

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
