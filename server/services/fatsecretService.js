const axios = require("axios");

let cachedToken = null;
let tokenExpiry = 0;

const MAX_RESULTS = 5;

async function getAccessToken() {

  const now = Date.now();

  if (cachedToken && now < tokenExpiry) {
    return cachedToken;
  }

  const response = await axios.post(
    "https://oauth.fatsecret.com/connect/token",
    new URLSearchParams({
      grant_type: "client_credentials",
      scope: "basic"
    }),
    {
      auth: {
        username: process.env.FATSECRET_CLIENT_ID,
        password: process.env.FATSECRET_CLIENT_SECRET
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      timeout: 10000
    }
  );

  cachedToken = response.data.access_token;

  tokenExpiry = Date.now() + (response.data.expires_in - 60) * 1000;

  return cachedToken;
}

async function searchFood(query) {

  const token = await getAccessToken();

  const response = await axios.get(
    "https://platform.fatsecret.com/rest/server.api",
    {
      params: {
        method: "foods.search",
        search_expression: query,
        format: "json"
      },
      headers: {
        Authorization: `Bearer ${token}`
      },
      timeout: 10000
    }
  );

  const foodsRaw = response.data?.foods?.food;

  if (!foodsRaw) return [];

  const foods = Array.isArray(foodsRaw) ? foodsRaw : [foodsRaw];

  let candidates = foods.filter(food => food.food_type === "Generic");

  if (candidates.length === 0) {
    candidates = foods;
  }

  return candidates.slice(0, MAX_RESULTS).map(food => ({
    id: food.food_id,
    name: food.food_name,
    brand: food.brand_name || null
  }));
}

async function getFoodDetails(foodId) {

  const token = await getAccessToken();

  const response = await axios.get(
    "https://platform.fatsecret.com/rest/server.api",
    {
      params: {
        method: "food.get",
        food_id: foodId,
        format: "json"
      },
      headers: {
        Authorization: `Bearer ${token}`
      },
      timeout: 10000
    }
  );

  const servingsRaw = response.data?.food?.servings?.serving;

  if (!servingsRaw) {
    throw new Error("No servings found for food");
  }

  const servings = Array.isArray(servingsRaw)
    ? servingsRaw
    : [servingsRaw];

  const serving = selectBestServing(servings);

  return {
    metric_serving_amount: parseFloat(serving.metric_serving_amount),
    metric_serving_unit: serving.metric_serving_unit,
    calories: parseFloat(serving.calories || 0),
    protein: parseFloat(serving.protein || 0),
    carbohydrate: parseFloat(serving.carbohydrate || 0),
    fat: parseFloat(serving.fat || 0)
  };
}

function selectBestServing(servings) {

  let serving = servings.find(
    s => s.metric_serving_unit === "ml" && parseFloat(s.metric_serving_amount) === 100
  );
  if (serving) return serving;

  serving = servings.find(
    s => s.metric_serving_unit === "g" && parseFloat(s.metric_serving_amount) === 100
  );
  if (serving) return serving;

  serving = servings.find(s => s.metric_serving_unit === "ml");
  if (serving) return serving;

  serving = servings.find(s => s.metric_serving_unit === "g");
  if (serving) return serving;

  throw new Error("No metric serving available");
}

module.exports = {
  getAccessToken,
  searchFood,
  getFoodDetails
};