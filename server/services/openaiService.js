const axios = require("axios");
const extractJSON = require("../utils/extractJSON");

async function callOpenAI(text) {

  const prompt = `
Extract the foods contained in the meal description.

Rules:
- Each ingredient must include a name, amount, and unit.
- Units must ONLY be "g" or "ml".
- Convert other units (cups, tbsp, pieces, etc.) into g or ml.
- Use reasonable estimates when necessary.
- Do not include explanations.

Return ONLY valid JSON in this format:

{
  "dishName": "",
  "ingredients": [
    { "name": "", "amount": 0, "unit": "g|ml" }
  ]
}

Meal:
${text}
`;

  const response = await axios.post(
    "https://api.openai.com/v1/responses",
    {
      model: "gpt-4.1-mini",
      input: prompt
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  const rawText = response.data?.output?.[0]?.content?.[0]?.text;

  if (!rawText) {
    throw new Error("Empty response from OpenAI");
  }

  return extractJSON(rawText);
}

module.exports = callOpenAI;