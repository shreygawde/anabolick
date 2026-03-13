function normalizeNutrition(nutrition, amount, unit) {

  const servingAmount = parseFloat(nutrition.metric_serving_amount);
  const servingUnit = nutrition.metric_serving_unit;

  if (!["g", "ml"].includes(servingUnit)) {
    throw new Error(`Unsupported serving unit: ${servingUnit}`);
  }

  if (servingUnit !== unit) {
    throw new Error(`Unit mismatch: ingredient ${unit} vs food ${servingUnit}`);
  }

  const caloriesPerUnit = parseFloat(nutrition.calories) / servingAmount;
  const proteinPerUnit = parseFloat(nutrition.protein) / servingAmount;
  const carbsPerUnit = parseFloat(nutrition.carbohydrate) / servingAmount;
  const fatPerUnit = parseFloat(nutrition.fat) / servingAmount;

  return {
    calories: caloriesPerUnit * amount,
    protein: proteinPerUnit * amount,
    carbs: carbsPerUnit * amount,
    fat: fatPerUnit * amount
  };
}