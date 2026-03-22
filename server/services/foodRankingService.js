const axios = require("axios");

function isGoodMatch(input, candidate) {
  const a = input.toLowerCase();
  const b = candidate.toLowerCase();

  if (b.includes(a) || a.includes(b)) return true;

  const aWords = a.split(" ");
  const bWords = b.split(" ");

  const overlap = aWords.filter(w => bWords.includes(w)).length;

  return overlap >= Math.ceil(aWords.length / 2);
}

async function chooseBestFood(ingredient, candidates) {
  console.log("Ranking service OPENAI KEY:", process.env.OPENAI_API_KEY?.slice(0,10));

  if (!candidates || candidates.length === 0) {
    throw new Error("No candidates provided for ranking");
  }

  const MAX_OPTIONS = 5;
  const limitedCandidates = candidates.slice(0, MAX_OPTIONS);

  const top = limitedCandidates[0];

  // 🚀 NEW: skip AI if good match
  if (top && isGoodMatch(ingredient, top.name)) {
    console.log(`Skipping AI for "${ingredient}" → using "${top.name}"`);
    return top;
  }

  // --- fallback to AI ---
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
- Prefer the base ingredient.
- Prefer generic foods over branded foods.
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