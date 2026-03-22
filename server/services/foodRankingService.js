const axios = require("axios");

async function chooseBestFood(ingredient, candidates) {
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
- The selected option MUST represent the FULL dish, not just a single ingredient.
- If the ingredient is a combined dish (e.g. "fish biryani", "chicken pasta"), do NOT select a single component like "fish" or "rice".
- Prefer options that match the complete prepared dish.
- Prefer common, generic versions of the dish.
- Avoid raw ingredients unless the input explicitly refers to them.
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
    console.warn("AI ranking failed, defaulting to first candidate");
    return limitedCandidates[0];
  }

  return limitedCandidates[index - 1];
}

module.exports = chooseBestFood;