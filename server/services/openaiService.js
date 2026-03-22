const axios = require("axios");
const extractJSON = require("../utils/extractJSON");

async function callOpenAI(text) {
const prompt = `
Extract the main food ingredients from the meal description.

Rules:
- Always include a dishName (short, natural name).
- Return only MAIN components(eg.chicken,rice,yoghurt,oil)
- Ignore minor ingredients (spices, salt, water).
- Each ingredient must have: name, amount, unit (g or ml).
- Amounts must be realistic.
- Total portion should represent a realistic single serving unless specified otherwise.
Return ONLY valid JSON:

{
  "dishName": "",
  "ingredients": [
    { "name": "food", "amount": 100, "unit": "g|ml" }
  ]
}

Meal:
${text}
`;
console.log("FINAL PROMPT SENT TO OPENAI:\n", prompt);
const response = await axios.post(
  "https://api.openai.com/v1/responses",
  {
    model: "gpt-4.1-mini",
    input: prompt,
    text: {
      format: {
        type: "json_object"
      }
    }
  },
  {
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    }
  }
);

const rawText = response.data.output?.[0]?.content?.[0]?.text;

if (!rawText) {
  throw new Error("Empty response from OpenAI");
}

const parsed = JSON.parse(rawText);
return parsed;
}

module.exports = callOpenAI;