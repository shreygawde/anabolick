const axios = require("axios");

// --- helper ---
function normalize(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim();
}

function isStrongMatch(input, candidate) {
  const a = normalize(input);
  const b = normalize(candidate);

  if (!a || !b) return false;

  if (a === b || b.includes(a) || a.includes(b)) return true;

  const aWords = a.split(/\s+/);
  const bWords = b.split(/\s+/);

  const overlap = aWords.filter(w => bWords.includes(w)).length;
  const ratio = overlap / aWords.length;

  return ratio >= 0.9;
}

async function chooseBestFood(ingredient, candidates) {
  if (!candidates || candidates.length === 0) {
    throw new Error("No candidates provided for ranking");
  }

  const start = Date.now();

  const MAX_OPTIONS = 5;
  const limitedCandidates = candidates.slice(0, MAX_OPTIONS);

  const top = limitedCandidates[0];

  // 🔥 SAFE SKIP
  if (top && top.name && isStrongMatch(ingredient, top.name)) {
    console.log(`[RANK] SKIP AI → "${ingredient}" → "${top.name}"`);
    return top;
  }

  console.log(`[RANK] USING AI → "${ingredient}"`);

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
- The match should reflect the FULL food.
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

  const duration = Date.now() - start;
  console.log(`[RANK] AI DONE (${duration}ms) → "${ingredient}"`);

  if (!raw) {
    throw new Error("OpenAI returned an empty response");
  }

  const match = raw.match(/\d+/);
  const index = match ? parseInt(match[0], 10) : null;

  if (!index || index < 1 || index > limitedCandidates.length) {
    console.warn(`[RANK] AI FAILED → defaulting to first`);
    return limitedCandidates[0];
  }

  return limitedCandidates[index - 1];
}

module.exports = chooseBestFood;