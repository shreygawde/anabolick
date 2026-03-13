function extractJSON(rawText) {

  if (!rawText) {
    throw new Error("Empty AI response");
  }

  // remove markdown code blocks if present
  const cleaned = rawText.replace(/```json|```/g, "");

  const match = cleaned.match(/\{[\s\S]*\}/);

  if (!match) {
    throw new Error("No JSON found in AI response");
  }

  let parsed;

  try {
    parsed = JSON.parse(match[0]);
  } catch (err) {
    throw new Error("Invalid JSON returned by AI");
  }

  if (!parsed.ingredients || !Array.isArray(parsed.ingredients)) {
    throw new Error("AI response missing ingredients array");
  }

  return parsed;

}

module.exports = extractJSON;