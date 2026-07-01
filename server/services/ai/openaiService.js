const axios = require("axios");

async function callOpenAI(text) {
  const prompt = `
Extract the main food ingredients from the meal description.

Rules:
- Always include a dishName (short, natural name).
- Return only MAIN components (eg. chicken, rice, yoghurt, oil).
- Ignore minor ingredients (spices, salt, water).
- Each ingredient must have: name, amount, unit (g or ml).
- Amounts must be realistic.
- Total portion should represent a realistic single serving unless specified otherwise.

Return ONLY valid JSON:

{
  "dishName": "",
  "ingredients": [
    {
      "name": "food",
      "amount": 100,
      "unit": "g"
    }
  ]
}

Meal:
${text}
`;

  try {
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
        },
        timeout: 60000
      }
    );

    const rawText =
      response.data.output_text ??
      response.data.output?.[0]?.content?.[0]?.text;

    if (!rawText) {
      console.error("Unexpected OpenAI response:");
      console.dir(response.data, { depth: null });
      throw new Error("Empty response from OpenAI");
    }

    console.log("\n===== RAW OPENAI JSON =====");
    console.log(rawText);

    const parsed = JSON.parse(rawText);

    console.log("\n===== PARSED OBJECT =====");
    console.dir(parsed, { depth: null });

    return parsed;

  } catch (err) {
    console.error("\n===== OPENAI ERROR =====");

    if (err.response) {
      console.error("Status:", err.response.status);
      console.dir(err.response.data, { depth: null });
    } else {
      console.error(err.message);
    }

    throw err;
  }
}

module.exports = callOpenAI;