const axios = require("axios");

async function chooseBestFood(ingredient, candidates) {
console.log("Ranking service OPENAI KEY:", process.env.OPENAI_API_KEY?.slice(0,10));
  if (!candidates || candidates.length === 0) {
    throw new Error("No candidates provided for ranking");
  }

  const MAX_OPTIONS = 5;
  const limitedCandidates = candidates.slice(0, MAX_OPTIONS);

  const options = limitedCandidates
    .map((c, i) => {
      const label = c.brand ? `${c.brand} ${c.name}` : c.name;
      return `${i + 1}. ${label}`;
    })
    .join("\n");

  const prompt = `
You are selecting the best database match for a food ingredient.

Ingredient: ${ingredient}

Options:
${options}

Rules:
- Choose the option that best represents the ingredient.
- Prefer the base ingredient (e.g., "egg" instead of "egg white").
- Prefer generic foods over branded foods when possible.
- Return ONLY the option number.
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
      },
      timeout: 10000
    }
  );

  const raw = response.data?.output?.[0]?.content?.[0]?.text;

  if (!raw) {
    throw new Error("OpenAI returned an empty response");
  }

  const match = raw.match(/\d+/);
  const index = match ? parseInt(match[0], 10) : null;

  if (!index || index < 1 || index > limitedCandidates.length) {
    throw new Error("Invalid ranking response from AI");
  }

  return limitedCandidates[index - 1];
}

module.exports = chooseBestFood;