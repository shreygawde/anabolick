function extractJSON(rawText) {

  const match = rawText.match(/\{[\s\S]*\}/);

  if (!match) {
    throw new Error("No JSON found in AI response");
  }

  try {
    return JSON.parse(match[0]);
  } catch (err) {
    throw new Error("Invalid JSON returned by AI");
  }

}

module.exports = extractJSON;