const axios = require("axios");
const extractJSON = require("../utils/extractJSON");

async function callOpenAI(text) {

  const response = await axios.post(
    "https://api.openai.com/v1/responses",
    {
      model: "gpt-4.1-mini",
      input: `
Extract food ingredients and estimated grams.

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

  return extractJSON(rawText);
}

module.exports = callOpenAI;