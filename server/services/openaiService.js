const axios = require("axios");
const extractJSON = require("../utils/extractJSON");

async function callOpenAI(text) {
console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY?.slice(0,8));
const prompt = `
Extract food items from the input.

- If it is a single dish (e.g., "chicken biryani", "pizza"), return it as ONE item inside the ingredients array.
- Only return multiple items if the input clearly contains separate foods.
- Each item must include name, amount, and unit (g or ml).

Return ONLY valid json.

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