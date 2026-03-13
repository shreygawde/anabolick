function round(value) {
  return Math.round(value * 100) / 100;
}

function normalizeNutrition(nutrition, amount, unit) {

  const servingAmount = parseFloat(nutrition.metric_serving_amount);
  const servingUnit = nutrition.metric_serving_unit;

  if (!["g", "ml"].includes(servingUnit)) {
    throw new Error(`Unsupported serving unit: ${servingUnit}`);
  }

  let adjustedAmount = amount;

  // Allow g ↔ ml interchange (common for liquids like milk)
  if (servingUnit !== unit) {

    if (
      (servingUnit === "g" && unit === "ml") ||
      (servingUnit === "ml" && unit === "g")
    ) {
      adjustedAmount = amount;
    } else {
      throw new Error(`Unit mismatch: ingredient ${unit} vs food ${servingUnit}`);
    }

  }

  const caloriesPerUnit = parseFloat(nutrition.calories) / servingAmount;
  const proteinPerUnit = parseFloat(nutrition.protein) / servingAmount;
  const carbsPerUnit = parseFloat(nutrition.carbohydrate) / servingAmount;
  const fatPerUnit = parseFloat(nutrition.fat) / servingAmount;

  return {
    calories: round(caloriesPerUnit * adjustedAmount),
    protein: round(proteinPerUnit * adjustedAmount),
    carbs: round(carbsPerUnit * adjustedAmount),
    fat: round(fatPerUnit * adjustedAmount)
  };
}

function calculateTotals(ingredients) {

  const totals = ingredients.reduce(
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

  return {
    calories: round(totals.calories),
    protein: round(totals.protein),
    carbs: round(totals.carbs),
    fat: round(totals.fat)
  };
}

module.exports = {
  normalizeNutrition,
  calculateTotals
};