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
function calculateTotals(ingredients) {

  return ingredients.reduce(
    (totals, item) => {
      totals.calories += item.calories || 0;
      totals.protein += item.protein || 0;
      totals.carbs += item.carbs || 0;
      totals.fat += item.fat || 0;
      return totals;
    },
    {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    }
  );
}
module.exports = {
  normalizeNutrition,
  calculateTotals
};