const axios = require("axios");

// --- helpers ---

function normalize(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim();
}

function isGoodMatch(input, candidate) {
  const a = normalize(input);
  const b = normalize(candidate);

  if (!a || !b) return false;

  // exact or near-exact match
  if (b.includes(a) || a.includes(b)) return true;

  const aWords = a.split(/\s+/);
  const bWords = b.split(/\s+/);

  const overlap = aWords.filter(w => bWords.includes(w)).length;
  const ratio = overlap / aWords.length;

  return ratio >= 0.4;
}

function strongWordMatch(input, candidate) {
  const a = normalize(input);
  const b = normalize(candidate);

  if (!a || !b) return false;

  const words = a.split(/\s+/);

  return words.every(w => b.includes(w));
}

function isClearlyTop(candidates) {
  if (candidates.length < 2) return true;

  const first = normalize(candidates[0].name || "");
  const second = normalize(candidates[1].name || "");

  if (!first || !second) return true;

  const firstWords = first.split(/\s+/);
  const secondWords = second.split(/\s+/);

  const overlap = firstWords.filter(w => secondWords.includes(w)).length;

  return overlap === 0;
}

// --- main function ---

async function chooseBestFood(ingredient, candidates) {
  if (!candidates || candidates.length === 0) {
    throw new Error("No candidates provided for ranking");
  }

  const MAX_OPTIONS = 5;
  const limitedCandidates = candidates.slice(0, MAX_OPTIONS);

  const top = limitedCandidates[0];

  // defensive guard
  if (!top || !top.name) {
    return limitedCandidates[0];
  }

  // 🔥 1. Few candidates → skip AI
  if (limitedCandidates.length <= 2) {
    console.log(`Few candidates → skipping AI`);
    return top;
  }

  // 🔥 2. Strong match → skip AI
  if (strongWordMatch(ingredient, top.name)) {
    console.log(`Strong word match → skipping AI`);
    return top;
  }

  // 🔥 3. Good match → skip AI
  if (isGoodMatch(ingredient, top.name)) {
    console.log(`Good match → skipping AI`);
    return top;
  }

  // 🔥 4. Clearly dominant → skip AI
  if (isClearlyTop(limitedCandidates)) {
    console.log(`Top candidate clearly dominant → skipping AI`);
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
    return top;
  }

  return limitedCandidates[index - 1];
}

module.exports = chooseBestFood;