const callOpenAI = require("./openaiService");
const { searchFood, getFoodDetails } = require("./fatsecretService");
const chooseBestFood = require("./foodRankingService");
const { normalizeNutrition, calculateTotals } = require("../utils/nutritionMath");

async function analyzeMeal(text) {

  const parsed = await callOpenAI(text);

  if (!parsed.ingredients || parsed.ingredients.length === 0) {
    throw new Error("No food items detected");
  }
if (parsed.ingredients.length > 12) {
  throw new Error("Meal too complex");
}
  /*
  -------------------------
  PHASE 1: FatSecret search
  -------------------------
  */

  const candidateLists = await Promise.all(
    parsed.ingredients.map(i => searchFood(i.name))
  );

  /*
  -------------------------
  PHASE 2: AI ranking
  -------------------------
  */

  const selectedFoods = await Promise.all(
    parsed.ingredients.map((ingredient, idx) => {

      const candidates = candidateLists[idx];

      if (!candidates || candidates.length === 0) {
        console.warn(`No candidates for ${ingredient.name}`);
        return null;
      }

      return chooseBestFood(
        ingredient.name,
        candidates
      );

    })
  );

  /*
  -------------------------
  PHASE 3: Nutrition lookup
  -------------------------
  */

  const nutritions = await Promise.all(
    selectedFoods.map(food => {

      if (!food) return null;

      return getFoodDetails(food.id);

    })
  );

  /*
  -------------------------
  PHASE 4: Normalize values
  -------------------------
  */

  const ingredients = parsed.ingredients.map((ingredient, idx) => {

    const nutrition = nutritions[idx];

    if (!nutrition) return null;

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

  }).filter(Boolean);

  const totals = calculateTotals(ingredients);

  return {
    dishName: parsed.dishName,
    ingredients,
    totals
  };
}

module.exports = analyzeMeal;