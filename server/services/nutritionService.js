async function analyzeMeal(text) {

  const parsed = await callOpenAI(text);

  const ingredientTasks = parsed.ingredients.map(async (ingredient) => {

    try {

      const candidates = await searchFood(ingredient.name);

      if (!candidates.length) {
        console.warn(`No candidates for ${ingredient.name}`);
        return null;
      }

      const selectedFood = await chooseBestFood(
        ingredient.name,
        candidates
      );

      const nutrition = await getFoodDetails(selectedFood.id);

      const normalized = normalizeNutrition(
        nutrition,
        ingredient.amount,
        ingredient.unit
      );

      return {
        name: ingredient.name,
        amount: ingredient.amount,
        unit: ingredient.unit,
        ...normalized
      };

    } catch (err) {

      console.error(`Ingredient failed: ${ingredient.name}`, err.message);
      return null;

    }

  });

  const ingredientResults = await Promise.all(ingredientTasks);

  const ingredients = ingredientResults.filter(Boolean);

  const totals = calculateTotals(ingredients);

  return {
    dishName: parsed.dishName,
    ingredients,
    totals
  };
}