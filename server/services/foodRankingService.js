const axios = require("axios");

async function chooseBestFood(ingredient, candidates) {

  if (!candidates || candidates.length === 0) {
    throw new Error("No candidates provided for ranking");
  }

  const options = candidates
    .map((c, i) => {
      const label = c.brand ? `${c.brand} ${c.name}` : c.name;
      return `${i + 1}. ${label}`;
    })
    .join("\n");

  const prompt = `
Ingredient: ${ingredient}

Options:
${options}

Return ONLY the number of the best match.
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

  const raw = response.data?.output?.[0]?.content?.[0]?.text;

  if (!raw) {
    throw new Error("OpenAI returned an empty response");
  }

  const index = parseInt(raw.match(/\d+/)?.[0], 10);

  if (!index || index < 1 || index > candidates.length) {
    throw new Error("Invalid ranking response from AI");
  }

  return candidates[index - 1];
}

module.exports = chooseBestFood;