async function analyzeMeal(text) {

  const parsed = await callOpenAI(text);

  const ingredients = [];

  for (const ingredient of parsed.ingredients) {

    const candidates = await searchFood(ingredient.name);

    const selectedFood = await chooseBestFood(
      ingredient.name,
      candidates
    );

    const nutrition = await getFoodDetails(selectedFood.id);

    const normalized = normalizeNutrition(
      nutrition,
      ingredient.grams
    );

    ingredients.push(normalized);
  }

  const totals = calculateTotals(ingredients);

  return {
    dishName: parsed.dishName,
    ingredients,
    totals
  };
}